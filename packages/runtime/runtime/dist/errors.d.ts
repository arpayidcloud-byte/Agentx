/**
 * @module runtime/errors
 * @description Hierarchical runtime errors.
 */
export declare class RuntimeError extends Error {
    readonly code: string;
    readonly source: string;
    constructor(message: string, code: string, source: string);
}
export declare class RuntimeRecoverableError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeNonRecoverableError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeTimeoutError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeCancellationError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeResourceLimitError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeWorkflowFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeApprovalFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeAgentFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeToolFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeContextFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeMemoryFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimeKnowledgeFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
export declare class RuntimePlannerFailureError extends RuntimeError {
    constructor(message: string, source: string);
}
//# sourceMappingURL=errors.d.ts.map