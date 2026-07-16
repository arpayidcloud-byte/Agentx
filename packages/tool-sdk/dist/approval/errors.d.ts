/**
 * @module approval/errors
 * @description Error types for Approval & Execution Governance.
 */
import { ToolError } from '../errors/index.js';
/** Base error for approval engine */
export declare class ApprovalError extends ToolError {
    constructor(message: string, code: string);
}
/** Thrown when an approval request is not found */
export declare class ApprovalNotFoundError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when an approval request has already been processed */
export declare class ApprovalAlreadyProcessedError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when an approval request has expired */
export declare class ApprovalExpiredError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when an approval request has been cancelled */
export declare class ApprovalCancelledError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when double confirmation is required but not provided */
export declare class ApprovalDoubleConfirmationRequiredError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when an approval token is invalid */
export declare class ApprovalTokenInvalidError extends ApprovalError {
    constructor(token: string);
}
/** Thrown when a replay attack is detected */
export declare class ApprovalReplayAttackError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when a duplicate approval is detected */
export declare class ApprovalDuplicateError extends ApprovalError {
    constructor(requestId: string);
}
/** Thrown when approval validation fails */
export declare class ApprovalValidationError extends ApprovalError {
    constructor(message: string);
}
/** Thrown when approval execution fails */
export declare class ApprovalExecutionError extends ApprovalError {
    constructor(requestId: string, reason: string);
}
/** Thrown when approval service is unavailable */
export declare class ApprovalServiceUnavailableError extends ApprovalError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map