/**
 * @module git/git-commit
 * @description Git commit tool implementation.
 * Creates new commits within sandbox.
 */
import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git commit tool for creating commits
 */
export declare class GitCommitTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git commit command
     * @param request - The execution request
     * @returns Execution result
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-commit.d.ts.map