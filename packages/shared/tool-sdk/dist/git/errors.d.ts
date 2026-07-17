/**
 * @module git/errors
 * @description Error types for Git Tool Foundation.
 */
import { ToolError } from '../errors/index.js';
/** Base error for all git execution errors */
export declare class GitError extends ToolError {
    constructor(message: string, code: string);
}
/** Thrown when a git operation is not allowed */
export declare class GitOperationNotAllowedError extends GitError {
    constructor(operation: string);
}
/** Thrown when a git operation is blocked */
export declare class GitOperationBlockedError extends GitError {
    constructor(operation: string, reason: string);
}
/** Thrown when a repository is not valid */
export declare class GitRepositoryNotFoundError extends GitError {
    constructor(path: string);
}
/** Thrown when a branch is invalid */
export declare class GitInvalidBranchError extends GitError {
    constructor(branch: string);
}
/** Thrown when a ref is invalid */
export declare class GitInvalidRefError extends GitError {
    constructor(ref: string);
}
/** Thrown when HEAD is detached and operation requires a branch */
export declare class GitDetachedHeadError extends GitError {
    constructor();
}
/** Thrown when force operations are disabled */
export declare class GitForceNotAllowedError extends GitError {
    constructor(operation: string);
}
/** Thrown when git execution times out */
export declare class GitTimeoutError extends GitError {
    constructor(operation: string, timeoutMs: number);
}
/** Thrown when working directory escapes workspace */
export declare class GitWorkspaceEscapeError extends GitError {
    constructor(path: string, workspace: string);
}
/** Thrown when empty commit is attempted */
export declare class GitEmptyCommitError extends GitError {
    constructor();
}
/** Thrown when orphan branch is attempted */
export declare class GitOrphanBranchError extends GitError {
    constructor(branch: string);
}
//# sourceMappingURL=errors.d.ts.map