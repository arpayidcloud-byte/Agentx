/**
 * @module git/git-diff
 * @description Git diff tool implementation.
 * Provides read-only git diff query within sandbox.
 */
import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git diff tool for comparing changes
 */
export declare class GitDiffTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git diff command
     * @param request - The execution request
     * @returns Execution result with parsed diff
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Parses git diff output
     * @param output - Raw git diff output
     * @returns Parsed GitDiffOutput
     */
    private parseDiff;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-diff.d.ts.map