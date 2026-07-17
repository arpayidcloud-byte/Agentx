/**
 * @module shell/errors
 * @description Error types for Shell Execution Foundation.
 */
import { ToolError } from '../errors/index.js';
/** Base error for all shell execution errors */
export declare class ShellError extends ToolError {
    constructor(message: string, code: string);
}
/** Thrown when a command is not in the allowlist */
export declare class CommandNotAllowedError extends ShellError {
    constructor(command: string);
}
/** Thrown when a command is in the blocked list */
export declare class CommandBlockedError extends ShellError {
    constructor(command: string, reason: string);
}
/** Thrown when a command contains injection attempts */
export declare class CommandInjectionError extends ShellError {
    constructor(command: string, pattern: string);
}
/** Thrown when a command times out */
export declare class ShellTimeoutError extends ShellError {
    constructor(command: string, timeoutMs: number);
}
/** Thrown when resource limits are exceeded */
export declare class ResourceLimitExceededError extends ShellError {
    constructor(resource: string, limit: number);
}
/** Thrown when working directory is invalid */
export declare class InvalidWorkingDirectoryError extends ShellError {
    constructor(directory: string);
}
/** Thrown when environment scrubbing fails */
export declare class EnvironmentScrubError extends ShellError {
    constructor(key: string);
}
/** Thrown when command parsing fails */
export declare class CommandParseError extends ShellError {
    constructor(command: string, reason: string);
}
/** Thrown when approval is required but not granted */
export declare class ApprovalRequiredError extends ShellError {
    constructor(command: string, classification: string);
}
//# sourceMappingURL=errors.d.ts.map