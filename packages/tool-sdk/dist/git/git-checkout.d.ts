/**
 * @module git/git-checkout
 * @description Git checkout tool implementation.
 * Switches branches or restores files within sandbox.
 */
import { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
/**
 * Git checkout tool for switching branches
 */
export declare class GitCheckoutTool {
    private executor;
    constructor(context: GitExecutionContext);
    /**
     * Executes git checkout command
     * @param request - The execution request
     * @returns Execution result
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Gets the audit emitter
     */
    getAuditEmitter(): import("../shell/audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=git-checkout.d.ts.map