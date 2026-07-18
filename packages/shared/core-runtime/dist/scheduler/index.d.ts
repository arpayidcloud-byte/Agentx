import type { IScheduler, ITaskRepository } from '../interfaces/scheduler.js';
import type { TaskModel } from '../interfaces/task.js';
import type { IEventBus } from '../interfaces/events.js';
export interface SchedulerConfig {
    maxConcurrentTaskGraphs?: number;
    maxParallelAgents?: number;
}
export declare class Scheduler implements IScheduler {
    private readonly eventBus;
    private readonly taskRepo;
    private inFlightTasks;
    private pausedTasks;
    private activeCount;
    private maxParallel;
    constructor(eventBus: IEventBus, taskRepo: ITaskRepository, config?: SchedulerConfig);
    enqueue(task: TaskModel): Promise<void>;
    pause(taskId: string): Promise<void>;
    resume(taskId: string): Promise<void>;
    cancel(taskId: string, reason: string): Promise<void>;
    private dispatch;
    completeTask(taskId: string, result: any): Promise<void>;
    failTask(taskId: string, error: any): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map