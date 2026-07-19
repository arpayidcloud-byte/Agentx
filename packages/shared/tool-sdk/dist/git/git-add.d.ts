/**
 * @module git/git-add
 * @description Git add tool implementation.
 * Stages changes for commit within sandbox.
 */
import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git add tool for staging changes
 */
export declare class GitAddTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git add command
     * @param request - The execution request
     * @returns Execution result
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-add.d.ts.map