import { TaskStatus } from '../interfaces/task.js';
import { EventTopic } from '../interfaces/events.js';
import { TaskStateMachine } from '../state-machine/index.js';
import { TaskNotFoundError } from '../errors.js';
import { Tracer, Metrics } from '@agentx/observability';
import { AgentXLoggerFactory } from '@agentx/shared';
/**
 * Scheduler manages task execution lifecycle and agent dispatch.
 * Handles task queuing, state transitions, and concurrent execution limits.
 * @example
 * ```ts
 * const scheduler = new Scheduler(eventBus, taskRepo, { maxParallelAgents: 10 });
 * await scheduler.enqueue(task);
 * ```
 */
export class Scheduler {
    eventBus;
    taskRepo;
    inFlightTasks = new Map();
    pausedTasks = new Set();
    activeCount = 0;
    maxParallel;
    tracer = new Tracer('core-runtime-scheduler');
    metrics = new Metrics();
    logger = new AgentXLoggerFactory().createLogger('core-runtime:scheduler');
    agentRegistry;
    /**
     * Creates a new Scheduler instance.
     * @param eventBus - Event bus for async communication and event publishing
     * @param taskRepo - Task repository for persistence
     * @param config - Optional scheduler configuration
     * @param agentRegistry - Optional agent registry for task execution
     */
    constructor(eventBus, taskRepo, config = {}, agentRegistry) {
        this.eventBus = eventBus;
        this.taskRepo = taskRepo;
        this.maxParallel = config.maxParallelAgents ?? 10;
        this.agentRegistry = agentRegistry;
    }
    /**
     * Sets the agent registry for task execution.
     * @param registry - Agent registry to use for executing tasks
     */
    setAgentRegistry(registry) {
        this.agentRegistry = registry;
    }
    /**
     * Enqueues a task for execution if it's in a valid initial state.
     * Transitions task to QUEUED status and triggers dispatch.
     * @param task - Task to enqueue
     * @throws Error if task save or event publishing fails
     * @example
     * ```ts
     * await scheduler.enqueue({ id: 'task-1', status: TaskStatus.CREATED, ... });
     * ```
     */
    async enqueue(task) {
        const span = this.tracer.startSpan('scheduler-enqueue');
        span.setAttribute('task.id', task.id);
        span.setAttribute('task.status', task.status);
        try {
            if (task.status === TaskStatus.CREATED ||
                task.status === TaskStatus.FAILED ||
                task.status === TaskStatus.RETRYING) {
                task = TaskStateMachine.transition(task, TaskStatus.QUEUED);
                await this.taskRepo.save(task);
                await this.eventBus.publish(EventTopic.TASK_QUEUED, task, task.traceId, task.id);
                this.inFlightTasks.set(task.id, task);
                this.metrics.counter('tasks_enqueued', 1, { status: task.status });
                await this.dispatch();
            }
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    }
    /**
     * Pauses a running task, transitioning it to WAITING_APPROVAL status.
     * @param taskId - ID of the task to pause
     * @throws TaskNotFoundError if task doesn't exist
     */
    async pause(taskId) {
        const span = this.tracer.startSpan('scheduler-pause');
        span.setAttribute('task.id', taskId);
        try {
            const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
            if (!task)
                throw new TaskNotFoundError(taskId);
            this.pausedTasks.add(taskId);
            if (task.status === TaskStatus.RUNNING) {
                task.status = TaskStatus.WAITING_APPROVAL;
                await this.taskRepo.save(task);
                await this.eventBus.publish(EventTopic.TASK_WAITING_APPROVAL, task, task.traceId, task.id);
            }
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    }
    /**
     * Resumes a paused task, transitioning it back to RUNNING status.
     * @param taskId - ID of the task to resume
     * @throws TaskNotFoundError if task doesn't exist
     */
    async resume(taskId) {
        const span = this.tracer.startSpan('scheduler-resume');
        span.setAttribute('task.id', taskId);
        try {
            if (!this.pausedTasks.has(taskId))
                return;
            this.pausedTasks.delete(taskId);
            const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
            if (!task)
                throw new TaskNotFoundError(taskId);
            if (task.status === TaskStatus.WAITING_APPROVAL) {
                task.status = TaskStatus.RUNNING;
                await this.taskRepo.save(task);
                await this.eventBus.publish(EventTopic.TASK_STARTED, task, task.traceId, task.id);
                await this.dispatch();
            }
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    }
    /**
     * Cancels a task with the given reason.
     * @param taskId - ID of the task to cancel
     * @param reason - Reason for cancellation
     * @throws TaskNotFoundError if task doesn't exist
     */
    async cancel(taskId, reason) {
        const span = this.tracer.startSpan('scheduler-cancel');
        span.setAttribute('task.id', taskId);
        try {
            const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
            if (!task)
                throw new TaskNotFoundError(taskId);
            task.cancellation = {
                reason,
                requestedBy: 'operator',
                timestamp: new Date(),
            };
            task.status = TaskStatus.CANCELLED;
            task.updatedAt = new Date();
            await this.taskRepo.save(task);
            await this.eventBus.publish(EventTopic.TASK_CANCELLED, task, task.traceId, task.id);
            this.inFlightTasks.delete(taskId);
            this.pausedTasks.delete(taskId);
            if (this.activeCount > 0)
                this.activeCount--;
            await this.dispatch();
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    }
    async dispatch() {
        for (const [taskId, task] of this.inFlightTasks.entries()) {
            if (this.activeCount >= this.maxParallel)
                break;
            if (this.pausedTasks.has(taskId))
                continue;
            if (task.status === TaskStatus.QUEUED) {
                task.status = TaskStatus.RUNNING;
                this.activeCount++;
                await this.taskRepo.save(task);
                await this.eventBus.publish(EventTopic.TASK_STARTED, task, task.traceId, task.id);
                // Execute agent if registry is configured
                if (this.agentRegistry && task.assignedAgentRole) {
                    this.executeAgent(task).catch((err) => {
                        this.failTask(taskId, err).catch((e) => this.logger.error('Failed to fail task', e));
                    });
                }
            }
        }
    }
    async executeAgent(task) {
        const span = this.tracer.startSpan('agent-execution');
        span.setAttribute('task.id', task.id);
        span.setAttribute('agent.role', task.assignedAgentRole || 'unknown');
        try {
            if (!this.agentRegistry) {
                throw new Error('Agent registry not configured');
            }
            const role = task.assignedAgentRole || 'coder';
            const result = await this.agentRegistry.executeByRole(role, task, task.context);
            await this.completeTask(task.id, result);
            this.metrics.counter('agent_executions', 1, { role, status: 'success' });
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            this.metrics.counter('agent_executions', 1, { status: 'failure' });
            throw error;
        }
        finally {
            span.end();
        }
    }
    /**
     * Marks a task as completed with the given result.
     * @param taskId - ID of the completed task
     * @param result - Task execution result
     */
    async completeTask(taskId, result) {
        const span = this.tracer.startSpan('scheduler-complete');
        span.setAttribute('task.id', taskId);
        try {
            const task = this.inFlightTasks.get(taskId);
            if (!task)
                return;
            task.result = result;
            task.status = TaskStatus.COMPLETED;
            task.updatedAt = new Date();
            await this.taskRepo.save(task);
            await this.eventBus.publish(EventTopic.TASK_COMPLETED, task, task.traceId, task.id);
            this.inFlightTasks.delete(taskId);
            this.activeCount--;
            this.metrics.counter('tasks_completed', 1);
            await this.dispatch();
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    }
    /**
     * Marks a task as failed with the given error.
     * @param taskId - ID of the failed task
     * @param error - Error that caused the failure
     */
    async failTask(taskId, error) {
        const span = this.tracer.startSpan('scheduler-fail');
        span.setAttribute('task.id', taskId);
        try {
            const task = this.inFlightTasks.get(taskId);
            if (!task)
                return;
            task.error = error;
            task.status = TaskStatus.FAILED;
            task.updatedAt = new Date();
            await this.taskRepo.save(task);
            await this.eventBus.publish(EventTopic.TASK_FAILED, task, task.traceId, task.id);
            this.inFlightTasks.delete(taskId);
            this.activeCount--;
            this.metrics.counter('tasks_failed', 1);
            await this.dispatch();
            span.setStatus({ code: 0 });
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            span.setStatus({ code: 1, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    }
    /**
     * Retrieves a task by ID from in-flight tasks or repository.
     * @param taskId - ID of the task to retrieve
     * @returns Task model if found, undefined otherwise
     */
    async getTask(taskId) {
        return this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
    }
}
//# sourceMappingURL=index.js.map