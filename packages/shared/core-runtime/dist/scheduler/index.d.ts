import type { IScheduler, ITaskRepository } from '../interfaces/scheduler.js';
import type { TaskModel } from '../interfaces/task.js';
import type { IEventBus } from '../interfaces/events.js';
import type { AgentRegistry } from '../registry/agent-registry.js';
/**
 * Configuration options for the Scheduler.
 */
export interface SchedulerConfig {
    /** Maximum number of concurrent task graphs */
    maxConcurrentTaskGraphs?: number;
    /** Maximum number of parallel agent executions */
    maxParallelAgents?: number;
}
/**
 * Scheduler manages task execution lifecycle and agent dispatch.
 * Handles task queuing, state transitions, and concurrent execution limits.
 * @example
 * ```ts
 * const scheduler = new Scheduler(eventBus, taskRepo, { maxParallelAgents: 10 });
 * await scheduler.enqueue(task);
 * ```
 */
export declare class Scheduler implements IScheduler {
    private readonly eventBus;
    private readonly taskRepo;
    private inFlightTasks;
    private pausedTasks;
    private activeCount;
    private maxParallel;
    private tracer;
    private metrics;
    private logger;
    private agentRegistry?;
    /**
     * Creates a new Scheduler instance.
     * @param eventBus - Event bus for async communication and event publishing
     * @param taskRepo - Task repository for persistence
     * @param config - Optional scheduler configuration
     * @param agentRegistry - Optional agent registry for task execution
     */
    constructor(eventBus: IEventBus, taskRepo: ITaskRepository, config?: SchedulerConfig, agentRegistry?: AgentRegistry);
    /**
     * Sets the agent registry for task execution.
     * @param registry - Agent registry to use for executing tasks
     */
    setAgentRegistry(registry: AgentRegistry): void;
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
    enqueue(task: TaskModel): Promise<void>;
    /**
     * Pauses a running task, transitioning it to WAITING_APPROVAL status.
     * @param taskId - ID of the task to pause
     * @throws TaskNotFoundError if task doesn't exist
     */
    pause(taskId: string): Promise<void>;
    /**
     * Resumes a paused task, transitioning it back to RUNNING status.
     * @param taskId - ID of the task to resume
     * @throws TaskNotFoundError if task doesn't exist
     */
    resume(taskId: string): Promise<void>;
    /**
     * Cancels a task with the given reason.
     * @param taskId - ID of the task to cancel
     * @param reason - Reason for cancellation
     * @throws TaskNotFoundError if task doesn't exist
     */
    cancel(taskId: string, reason: string): Promise<void>;
    private dispatch;
    private executeAgent;
    /**
     * Marks a task as completed with the given result.
     * @param taskId - ID of the completed task
     * @param result - Task execution result
     */
    completeTask(taskId: string, result: unknown): Promise<void>;
    /**
     * Marks a task as failed with the given error.
     * @param taskId - ID of the failed task
     * @param error - Error that caused the failure
     */
    failTask(taskId: string, error: unknown): Promise<void>;
    /**
     * Retrieves a task by ID from in-flight tasks or repository.
     * @param taskId - ID of the task to retrieve
     * @returns Task model if found, undefined otherwise
     */
    getTask(taskId: string): Promise<TaskModel | undefined>;
}
//# sourceMappingURL=index.d.ts.map