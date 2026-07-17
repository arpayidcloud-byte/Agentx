/**
 * @module git/git-status
 * @description Git status tool implementation.
 * Provides read-only git status query within sandbox.
 */
import { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git status tool for querying repository status
 */
export declare class GitStatusTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git status command
     * @param request - The execution request
     * @returns Execution result with parsed status
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Parses git status output
     * @param output - Raw git status output
     * @returns Parsed GitStatusOutput
     */
    private parseStatus;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-status.d.ts.map