/**
 * @module git/git-restore
 * @description Git restore tool implementation.
 * Restores file contents within sandbox.
 */
import { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git restore tool for restoring file contents
 */
export declare class GitRestoreTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git restore command
     * @param request - The execution request
     * @returns Execution result
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-restore.d.ts.map