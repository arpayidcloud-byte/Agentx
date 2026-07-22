import type { IScheduler, ITaskRepository } from '../interfaces/scheduler.js';
import type { TaskModel } from '../interfaces/task.js';
import type { IEventBus } from '../interfaces/events.js';
import type { AgentRegistry } from '../registry/agent-registry.js';
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
    private tracer;
    private metrics;
    private agentRegistry?;
    constructor(eventBus: IEventBus, taskRepo: ITaskRepository, config?: SchedulerConfig, agentRegistry?: AgentRegistry);
    setAgentRegistry(registry: AgentRegistry): void;
    enqueue(task: TaskModel): Promise<void>;
    pause(taskId: string): Promise<void>;
    resume(taskId: string): Promise<void>;
    cancel(taskId: string, reason: string): Promise<void>;
    private dispatch;
    private executeAgent;
    completeTask(taskId: string, result: unknown): Promise<void>;
    failTask(taskId: string, error: unknown): Promise<void>;
    getTask(taskId: string): Promise<TaskModel | undefined>;
}
//# sourceMappingURL=index.d.ts.map