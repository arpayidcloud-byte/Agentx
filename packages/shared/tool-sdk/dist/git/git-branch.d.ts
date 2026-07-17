/**
 * @module git/git-branch
 * @description Git branch tool implementation.
 * Provides read-only git branch query within sandbox.
 */
import { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git branch tool for listing branches
 */
export declare class GitBranchTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git branch command
     * @param request - The execution request
     * @returns Execution result with parsed branches
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Parses git branch output
     * @param output - Raw git branch output
     * @returns Parsed GitBranchOutput
     */
    private parseBranches;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-branch.d.ts.map