/**
 * @module git/git-reset
 * @description Git reset tool implementation.
 * Resets history within sandbox (destructive operation).
 */
import { GitExecutor } from './executor.js';
import { isForceOperation } from './validator.js';
/**
 * Git reset tool for resetting history
 */
export class GitResetTool {
    executor;
    constructor(context) {
        this.executor = new GitExecutor(context);
    }
    /**
     * Executes git reset command
     * @param request - The execution request
     * @returns Execution result
     */
    async execute(request) {
        // Check for force operations
        if (isForceOperation(request.args)) {
            return {
                exitCode: 1,
                stdout: '',
                stderr: 'Force reset is not allowed',
                durationMs: 0,
                allowed: true,
                timedOut: false,
            };
        }
        return this.executor.execute({
            ...request,
            operation: 'git.reset',
        });
    }
    /**
     * Gets the audit emitter
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=git-reset.js.map