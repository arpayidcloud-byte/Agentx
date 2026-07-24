/**
 * @module core-runtime/errors
 * @description Error classes for the AgentX core runtime.
 */
/**
 * Base error class for all core-runtime errors.
 *
 * @example
 * ```ts
 * throw new CoreRuntimeError('Something went wrong', 'INTERNAL_ERROR');
 * ```
 */
export declare class CoreRuntimeError extends Error {
    readonly code: string;
    /**
     * @param message - Human-readable error message
     * @param code - Machine-readable error code
     */
    constructor(message: string, code: string);
}
/**
 * Thrown when a task attempts an invalid state transition.
 *
 * @example
 * ```ts
 * throw new IllegalStateTransitionError('task-123', 'COMPLETED', 'RUNNING');
 * ```
 */
export declare class IllegalStateTransitionError extends CoreRuntimeError {
    /**
     * @param taskId - ID of the task that attempted the transition
     * @param from - The current state
     * @param to - The requested state
     */
    constructor(taskId: string, from: string, to: string);
}
/**
 * Thrown when a requested task cannot be found.
 *
 * @example
 * ```ts
 * throw new TaskNotFoundError('task-123');
 * ```
 */
export declare class TaskNotFoundError extends CoreRuntimeError {
    /**
     * @param taskId - ID of the task that was not found
     */
    constructor(taskId: string);
}
/**
 * Thrown when attempting to create a task that already exists.
 *
 * @example
 * ```ts
 * throw new DuplicateTaskError('task-123');
 * ```
 */
export declare class DuplicateTaskError extends CoreRuntimeError {
    /**
     * @param taskId - ID of the duplicate task
     */
    constructor(taskId: string);
}
/**
 * Thrown when an event bus operation fails.
 *
 * @example
 * ```ts
 * throw new EventBusError('Failed to publish event');
 * ```
 */
export declare class EventBusError extends CoreRuntimeError {
    /**
     * @param message - Description of the event bus failure
     */
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map