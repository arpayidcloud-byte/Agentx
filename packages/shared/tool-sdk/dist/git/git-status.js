/**
 * @module git/git-status
 * @description Git status tool implementation.
 * Provides read-only git status query within sandbox.
 */
import { GitExecutor } from './executor.js';
/**
 * Git status tool for querying repository status
 */
export class GitStatusTool {
    executor;
    constructor(context) {
        this.executor = new GitExecutor(context);
    }
    /**
     * Executes git status command
     * @param request - The execution request
     * @returns Execution result with parsed status
     */
    async execute(request) {
        const result = await this.executor.execute({
            ...request,
            operation: 'git.status',
        });
        if (result.allowed && result.exitCode === 0) {
            result.parsedOutput = {
                operation: 'git.status',
                raw: result.stdout,
                data: this.parseStatus(result.stdout),
            };
        }
        return result;
    }
    /**
     * Parses git status output
     * @param output - Raw git status output
     * @returns Parsed GitStatusOutput
     */
    parseStatus(output) {
        const lines = output.split('\n').filter((line) => line.trim().length > 0);
        const changed = [];
        for (const line of lines) {
            if (line.length >= 3) {
                const indexStatus = line[0] || ' ';
                const workingTreeStatus = line[1] || ' ';
                const path = line.substring(3).trim();
                if (path && (indexStatus !== ' ' || workingTreeStatus !== ' ')) {
                    changed.push({
                        path,
                        statusCode: indexStatus + workingTreeStatus,
                        indexStatus,
                        workingTreeStatus,
                    });
                }
            }
        }
        return {
            branch: 'HEAD',
            ahead: 0,
            behind: 0,
            changed,
        };
    }
    /**
     * Gets the audit emitter
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=git-status.js.map