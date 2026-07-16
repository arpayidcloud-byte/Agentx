/**
 * @module git/sandbox
 * @description Git sandbox implementation.
 * Enforces workspace jail for all git operations.
 */
import { GitSandboxConfig, GitExecutionRequest, GitRepositoryInfo, GitOperation } from './interfaces.js';
/**
 * Git sandbox that enforces security policies
 */
export declare class GitSandbox {
    private config;
    constructor(config: GitSandboxConfig);
    /**
     * Validates a git execution request
     * @param request - The execution request to validate
     * @param repoInfo - Repository information
     * @returns GitRepositoryInfo
     */
    validate(request: GitExecutionRequest, repoInfo?: GitRepositoryInfo): GitRepositoryInfo;
    /**
     * Checks if an operation is allowed
     * @param operation - Git operation to check
     * @returns true if allowed
     */
    isOperationAllowed(operation: GitOperation): boolean;
    /**
     * Validates arguments for dangerous operations
     * @param request - The execution request
     */
    private validateArgs;
}
//# sourceMappingURL=sandbox.d.ts.map