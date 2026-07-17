/**
 * @module git/git-restore
 * @description Git restore tool implementation.
 * Restores file contents within sandbox.
 */
import { GitExecutor } from './executor.js';
/**
 * Git restore tool for restoring file contents
 */
export class GitRestoreTool {
    executor;
    constructor(context) {
        this.executor = new GitExecutor(context);
    }
    /**
     * Executes git restore command
     * @param request - The execution request
     * @returns Execution result
     */
    async execute(request) {
        return this.executor.execute({
            ...request,
            operation: 'git.restore',
        });
    }
    /**
     * Gets the audit emitter
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=git-restore.js.map