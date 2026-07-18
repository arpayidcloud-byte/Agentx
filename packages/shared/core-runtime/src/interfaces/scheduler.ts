import type { TaskModel } from './task.js';

export interface IRetryPolicy {
  readonly type: 'exponential' | 'linear' | 'constant';
  readonly maxAttempts: number;
  readonly initialDelayMs: number;
  readonly backoffMultiplier: number;
  readonly maxDelayMs?: number;

  calculateDelay(attempt: number): number;
  isRetryable(error: Error): boolean;
}

export interface IScheduler {
  enqueue(task: TaskModel): Promise<void>;
  pause(taskId: string): Promise<void>;
  resume(taskId: string): Promise<void>;
  cancel(taskId: string, reason: string): Promise<void>;
}

export interface ITaskRepository {
  save(task: TaskModel): Promise<void>;
  findById(id: string): Promise<TaskModel | undefined>;
  findByRootId(rootId: string): Promise<TaskModel[]>;
}

export interface ITaskLifecycleObserver {
  onStateChange(task: TaskModel, previous: string): Promise<void>;
}
