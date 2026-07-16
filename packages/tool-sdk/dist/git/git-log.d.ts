/**
 * @module git/git-log
 * @description Git log tool implementation.
 * Provides read-only git log query within sandbox.
 */
import { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git log tool for viewing commit history
 */
export declare class GitLogTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git log command
     * @param request - The execution request
     * @returns Execution result with parsed log
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Parses git log output
     * @param output - Raw git log output
     * @returns Parsed GitLogOutput
     */
    private parseLog;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-log.d.ts.map