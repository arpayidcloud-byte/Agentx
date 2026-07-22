import type { IScheduler, ITaskRepository } from '../interfaces/scheduler.js';
import type { TaskModel } from '../interfaces/task.js';
import { TaskStatus } from '../interfaces/task.js';
import type { IEventBus } from '../interfaces/events.js';
import { EventTopic } from '../interfaces/events.js';
import { TaskStateMachine } from '../state-machine/index.js';
import { TaskNotFoundError } from '../errors.js';
import { Tracer, Metrics } from '@agentx/observability';
import type { AgentRegistry } from '../registry/agent-registry.js';

export interface SchedulerConfig {
  maxConcurrentTaskGraphs?: number;
  maxParallelAgents?: number;
}

export class Scheduler implements IScheduler {
  private inFlightTasks = new Map<string, TaskModel>();
  private pausedTasks = new Set<string>();
  private activeCount = 0;
  private maxParallel: number;
  private tracer = new Tracer('core-runtime-scheduler');
  private metrics = new Metrics();
  private agentRegistry?: AgentRegistry;

  constructor(
    private readonly eventBus: IEventBus,
    private readonly taskRepo: ITaskRepository,
    config: SchedulerConfig = {},
    agentRegistry?: AgentRegistry,
  ) {
    this.maxParallel = config.maxParallelAgents ?? 10;
    this.agentRegistry = agentRegistry;
  }

  public setAgentRegistry(registry: AgentRegistry): void {
    this.agentRegistry = registry;
  }

  public async enqueue(task: TaskModel): Promise<void> {
    const span = this.tracer.startSpan('scheduler-enqueue');
    span.setAttribute('task.id', task.id);
    span.setAttribute('task.status', task.status);
    try {
      if (
        task.status === TaskStatus.CREATED ||
        task.status === TaskStatus.FAILED ||
        task.status === TaskStatus.RETRYING
      ) {
        task = TaskStateMachine.transition(task, TaskStatus.QUEUED);
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_QUEUED, task, task.traceId, task.id);

        this.inFlightTasks.set(task.id, task);
        this.metrics.counter('tasks_enqueued', 1, { status: task.status });
        await this.dispatch();
      }
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  public async pause(taskId: string): Promise<void> {
    const span = this.tracer.startSpan('scheduler-pause');
    span.setAttribute('task.id', taskId);
    try {
      const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
      if (!task) throw new TaskNotFoundError(taskId);

      this.pausedTasks.add(taskId);
      if (task.status === TaskStatus.RUNNING) {
        task.status = TaskStatus.WAITING_APPROVAL;
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_WAITING_APPROVAL, task, task.traceId, task.id);
      }
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  public async resume(taskId: string): Promise<void> {
    const span = this.tracer.startSpan('scheduler-resume');
    span.setAttribute('task.id', taskId);
    try {
      if (!this.pausedTasks.has(taskId)) return;
      this.pausedTasks.delete(taskId);

      const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
      if (!task) throw new TaskNotFoundError(taskId);

      if (task.status === TaskStatus.WAITING_APPROVAL) {
        task.status = TaskStatus.RUNNING;
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_STARTED, task, task.traceId, task.id);
        await this.dispatch();
      }
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  public async cancel(taskId: string, reason: string): Promise<void> {
    const span = this.tracer.startSpan('scheduler-cancel');
    span.setAttribute('task.id', taskId);
    try {
      const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
      if (!task) throw new TaskNotFoundError(taskId);

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

      if (this.activeCount > 0) this.activeCount--;
      await this.dispatch();
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  private async dispatch(): Promise<void> {
    for (const [taskId, task] of this.inFlightTasks.entries() as IterableIterator<
      [string, TaskModel]
    >) {
      if (this.activeCount >= this.maxParallel) break;
      if (this.pausedTasks.has(taskId as string)) continue;

      if ((task as TaskModel).status === TaskStatus.QUEUED) {
        (task as TaskModel).status = TaskStatus.RUNNING;
        this.activeCount++;
        await this.taskRepo.save(task as TaskModel);
        await this.eventBus.publish(
          EventTopic.TASK_STARTED,
          task as TaskModel,
          (task as TaskModel).traceId,
          (task as TaskModel).id,
        );

        // Execute agent if registry is configured
        if (this.agentRegistry && task.assignedAgentRole) {
          this.executeAgent(task).catch((err) => {
            this.failTask(taskId, err).catch(console.error);
          });
        }
      }
    }
  }

  private async executeAgent(task: TaskModel): Promise<void> {
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
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      this.metrics.counter('agent_executions', 1, { status: 'failure' });
      throw error;
    } finally {
      span.end();
    }
  }

  public async completeTask(taskId: string, result: unknown): Promise<void> {
    const span = this.tracer.startSpan('scheduler-complete');
    span.setAttribute('task.id', taskId);
    try {
      const task = this.inFlightTasks.get(taskId);
      if (!task) return;
      task.result = result as TaskModel['result'];
      task.status = TaskStatus.COMPLETED;
      task.updatedAt = new Date();
      await this.taskRepo.save(task);
      await this.eventBus.publish(EventTopic.TASK_COMPLETED, task, task.traceId, task.id);

      this.inFlightTasks.delete(taskId);
      this.activeCount--;
      this.metrics.counter('tasks_completed', 1);
      await this.dispatch();
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  public async failTask(taskId: string, error: unknown): Promise<void> {
    const span = this.tracer.startSpan('scheduler-fail');
    span.setAttribute('task.id', taskId);
    try {
      const task = this.inFlightTasks.get(taskId);
      if (!task) return;
      task.error = error as TaskModel['error'];
      task.status = TaskStatus.FAILED;
      task.updatedAt = new Date();
      await this.taskRepo.save(task);
      await this.eventBus.publish(EventTopic.TASK_FAILED, task, task.traceId, task.id);

      this.inFlightTasks.delete(taskId);
      this.activeCount--;
      this.metrics.counter('tasks_failed', 1);
      await this.dispatch();
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  public async getTask(taskId: string): Promise<TaskModel | undefined> {
    return this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
  }
}
