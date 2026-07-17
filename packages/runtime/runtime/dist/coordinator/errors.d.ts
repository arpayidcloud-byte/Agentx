/**
 * @module coordinator/errors
 * @description Error classes for the Production Execution Coordinator.
 */
export declare class CoordinatorError extends Error {
    readonly code: string;
    readonly source: string;
    constructor(message: string, code: string, source: string);
}
export declare class CoordinatorStateError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorSchedulingError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorExecutionError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorTimeoutError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorCancelledError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorDependencyError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorBatchError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorConcurrencyError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorResourceLimitError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorReservationError extends CoordinatorError {
    constructor(message: string, source: string);
}
export declare class CoordinatorRecoveryError extends CoordinatorError {
    constructor(message: string, source: string);
}
//# sourceMappingURL=errors.d.ts.map