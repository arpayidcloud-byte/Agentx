export declare class CoreRuntimeError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
export declare class IllegalStateTransitionError extends CoreRuntimeError {
    constructor(taskId: string, from: string, to: string);
}
export declare class TaskNotFoundError extends CoreRuntimeError {
    constructor(taskId: string);
}
export declare class DuplicateTaskError extends CoreRuntimeError {
    constructor(taskId: string);
}
export declare class EventBusError extends CoreRuntimeError {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map