/**
 * @module git/git-diff
 * @description Git diff tool implementation.
 * Provides read-only git diff query within sandbox.
 */
import { GitExecutor } from './executor.js';
/**
 * Git diff tool for comparing changes
 */
export class GitDiffTool {
    executor;
    constructor(context) {
        this.executor = new GitExecutor(context);
    }
    /**
     * Executes git diff command
     * @param request - The execution request
     * @returns Execution result with parsed diff
     */
    async execute(request) {
        const result = await this.executor.execute({
            ...request,
            operation: 'git.diff',
        });
        if (result.allowed && result.exitCode === 0) {
            result.parsedOutput = {
                operation: 'git.diff',
                raw: result.stdout,
                data: this.parseDiff(result.stdout),
            };
        }
        return result;
    }
    /**
     * Parses git diff output
     * @param output - Raw git diff output
     * @returns Parsed GitDiffOutput
     */
    parseDiff(output) {
        const files = [];
        const lines = output.split('\n');
        let currentFile = null;
        for (const line of lines) {
            if (line.startsWith('diff --git')) {
                const pathMatch = line.match(/b\/(.*)$/);
                if (pathMatch && pathMatch[1]) {
                    currentFile = {
                        path: pathMatch[1],
                        hunks: [],
                    };
                    files.push(currentFile);
                }
            }
            else if (line.startsWith('@@') && currentFile) {
                const hunkMatch = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
                if (hunkMatch) {
                    currentFile.hunks.push({
                        startLine: parseInt(hunkMatch[2] || '1'),
                        lineCount: 0,
                        lines: [],
                    });
                }
            }
            else if (currentFile && currentFile.hunks.length > 0) {
                const currentHunk = currentFile.hunks[currentFile.hunks.length - 1];
                if (currentHunk) {
                    currentHunk.lines.push(line);
                    currentHunk.lineCount++;
                }
            }
        }
        return { content: output, files };
    }
    /**
     * Gets the audit emitter
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=git-diff.js.map