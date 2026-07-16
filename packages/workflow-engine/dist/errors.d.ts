/**
 * @module workflow-engine/errors
 * @description Error types for Workflow Engine.
 */
export declare class WorkflowError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
export declare class WorkflowCompilationError extends WorkflowError {
    constructor(message: string);
}
export declare class WorkflowValidationError extends WorkflowError {
    constructor(message: string);
}
export declare class CycleDetectedError extends WorkflowError {
    constructor(message?: string);
}
export declare class DeadlockDetectedError extends WorkflowError {
    constructor(message?: string);
}
export declare class NodeNotFoundError extends WorkflowError {
    constructor(nodeId: string);
}
export declare class WorkflowExecutionError extends WorkflowError {
    constructor(nodeId: string, reason: string);
}
export declare class WorkflowTimeoutError extends WorkflowError {
    constructor(workflowId: string, timeoutMs: number);
}
export declare class SnapshotError extends WorkflowError {
    constructor(message: string);
}
export declare class ResumeError extends WorkflowError {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map