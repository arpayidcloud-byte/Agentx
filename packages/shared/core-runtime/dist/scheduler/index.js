import { TaskStatus } from '../interfaces/task.js';
import { EventTopic } from '../interfaces/events.js';
import { TaskStateMachine } from '../state-machine/index.js';
import { TaskNotFoundError } from '../errors.js';
import { Tracer, Metrics } from '@agentx/observability';
export class Scheduler {
    eventBus;
    taskRepo;
    inFlightTasks = new Map();
    pausedTasks = new Set();
    activeCount = 0;
    maxParallel;
    tracer = new Tracer('core-runtime-scheduler');
    metrics = new Metrics();
    constructor(eventBus, taskRepo, config = {}) {
        this.eventBus = eventBus;
        this.taskRepo = taskRepo;
        this.maxParallel = config.maxParallelAgents ?? 10;
    }
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
            }
        }
    }
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
}
//# sourceMappingURL=index.js.map