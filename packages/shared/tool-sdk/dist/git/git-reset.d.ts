/**
 * @module git/git-reset
 * @description Git reset tool implementation.
 * Resets history within sandbox (destructive operation).
 */
import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git reset tool for resetting history
 */
export declare class GitResetTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git reset command
     * @param request - The execution request
     * @returns Execution result
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-reset.d.ts.map