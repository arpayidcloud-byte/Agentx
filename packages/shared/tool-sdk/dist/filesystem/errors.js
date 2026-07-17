import { ToolError } from '../errors/index.js';
export class SandboxViolationError extends ToolError {
    constructor(message) {
        super(message, 'SANDBOX_VIOLATION');
    }
}
export class PathTraversalError extends SandboxViolationError {
    constructor(path, reason) {
        super(`Path traversal attempt detected on ${path}: ${reason}`);
    }
}
export class WorkspaceEscapeError extends SandboxViolationError {
    constructor(path, workspaceRoot) {
        super(`Path ${path} escaped the workspace jail root of ${workspaceRoot}`);
    }
}
export class AllowlistViolationError extends SandboxViolationError {
    constructor(path) {
        super(`Path ${path} violates the filesystem allowlist configuration policy`);
    }
}
export class FileTooLargeError extends SandboxViolationError {
    constructor(sizeBytes, maxBytes) {
        super(`File size ${sizeBytes} exceeds maximum permitted limit of ${maxBytes} bytes`);
    }
}
export class InvalidEncodingError extends SandboxViolationError {
    constructor(reason) {
        super(`Invalid encoding or binary content detected: ${reason}`);
    }
}
export class AtomicWriteError extends ToolError {
    constructor(message, originalError) {
        super(`Atomic write operation failed: ${message} (Original: ${originalError?.message})`, 'ATOMIC_WRITE_ERROR');
    }
}
//# sourceMappingURL=errors.js.map