import type { IScheduler, ITaskRepository } from '../interfaces/scheduler.js';
import type { TaskModel } from '../interfaces/task.js';
import { TaskStatus } from '../interfaces/task.js';
import type { IEventBus } from '../interfaces/events.js';
import { EventTopic } from '../interfaces/events.js';
import { TaskStateMachine } from '../state-machine/index.js';
import { TaskNotFoundError } from '../errors.js';

export interface SchedulerConfig {
  maxConcurrentTaskGraphs?: number;
  maxParallelAgents?: number;
}

export class Scheduler implements IScheduler {
  private inFlightTasks = new Map<string, TaskModel>();
  private pausedTasks = new Set<string>();
  private activeCount = 0;
  private maxParallel: number;

  constructor(
    private readonly eventBus: IEventBus,
    private readonly taskRepo: ITaskRepository,
    config: SchedulerConfig = {},
  ) {
    this.maxParallel = config.maxParallelAgents ?? 10;
  }

  public async enqueue(task: TaskModel): Promise<void> {
    if (
      task.status === TaskStatus.CREATED ||
      task.status === TaskStatus.FAILED ||
      task.status === TaskStatus.RETRYING
    ) {
      task = TaskStateMachine.transition(task, TaskStatus.QUEUED);
      await this.taskRepo.save(task);
      await this.eventBus.publish(EventTopic.TASK_QUEUED, task, task.traceId, task.id);

      this.inFlightTasks.set(task.id, task);
      await this.dispatch();
    }
  }

  public async pause(taskId: string): Promise<void> {
    const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
    if (!task) throw new TaskNotFoundError(taskId);

    this.pausedTasks.add(taskId);
    if (task.status === TaskStatus.RUNNING) {
      task.status = TaskStatus.WAITING_APPROVAL;
      await this.taskRepo.save(task);
      await this.eventBus.publish(EventTopic.TASK_WAITING_APPROVAL, task, task.traceId, task.id);
    }
  }

  public async resume(taskId: string): Promise<void> {
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
  }

  public async cancel(taskId: string, reason: string): Promise<void> {
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
  }

  private async dispatch(): Promise<void> {
    for (const [taskId, task] of this.inFlightTasks.entries()) {
      if (this.activeCount >= this.maxParallel) break;
      if (this.pausedTasks.has(taskId)) continue;

      if (task.status === TaskStatus.QUEUED) {
        task.status = TaskStatus.RUNNING;
        this.activeCount++;
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_STARTED, task, task.traceId, task.id);
      }
    }
  }

  public async completeTask(taskId: string, result: any): Promise<void> {
    const task = this.inFlightTasks.get(taskId);
    if (!task) return;
    task.result = result;
    task.status = TaskStatus.COMPLETED;
    task.updatedAt = new Date();
    await this.taskRepo.save(task);
    await this.eventBus.publish(EventTopic.TASK_COMPLETED, task, task.traceId, task.id);

    this.inFlightTasks.delete(taskId);
    this.activeCount--;
    await this.dispatch();
  }

  public async failTask(taskId: string, error: any): Promise<void> {
    const task = this.inFlightTasks.get(taskId);
    if (!task) return;
    task.error = error;
    task.status = TaskStatus.FAILED;
    task.updatedAt = new Date();
    await this.taskRepo.save(task);
    await this.eventBus.publish(EventTopic.TASK_FAILED, task, task.traceId, task.id);

    this.inFlightTasks.delete(taskId);
    this.activeCount--;
    await this.dispatch();
  }
}
