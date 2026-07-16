import { ToolError } from '../errors/index.js';
export declare class SandboxViolationError extends ToolError {
    constructor(message: string);
}
export declare class PathTraversalError extends SandboxViolationError {
    constructor(path: string, reason: string);
}
export declare class WorkspaceEscapeError extends SandboxViolationError {
    constructor(path: string, workspaceRoot: string);
}
export declare class AllowlistViolationError extends SandboxViolationError {
    constructor(path: string);
}
export declare class FileTooLargeError extends SandboxViolationError {
    constructor(sizeBytes: number, maxBytes: number);
}
export declare class InvalidEncodingError extends SandboxViolationError {
    constructor(reason: string);
}
export declare class AtomicWriteError extends ToolError {
    constructor(message: string, originalError?: Error);
}
//# sourceMappingURL=errors.d.ts.map