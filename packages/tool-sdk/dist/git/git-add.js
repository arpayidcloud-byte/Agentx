/**
 * @module git/git-add
 * @description Git add tool implementation.
 * Stages changes for commit within sandbox.
 */
import { GitExecutor } from './executor.js';
/**
 * Git add tool for staging changes
 */
export class GitAddTool {
    executor;
    constructor(context) {
        this.executor = new GitExecutor(context);
    }
    /**
     * Executes git add command
     * @param request - The execution request
     * @returns Execution result
     */
    async execute(request) {
        return this.executor.execute({
            ...request,
            operation: 'git.add',
        });
    }
    /**
     * Gets the audit emitter
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=git-add.js.map