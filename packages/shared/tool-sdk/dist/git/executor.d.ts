/**
 * @module git/executor
 * @description Git executor that uses child_process.spawn() ONLY.
 * Never uses exec() or execSync() per Volume 7 requirements.
 */
import type { GitExecutionRequest, GitExecutionResult, GitExecutionContext } from './interfaces.js';
import { ShellAuditEmitter } from '../shell/audit.js';
/**
 * Git executor with full security pipeline
 */
export declare class GitExecutor {
    private sandbox;
    private auditEmitter;
    private context;
    constructor(context: GitExecutionContext);
    /**
     * Determines the audit category for a git operation
     * @param operation - The git operation name
     * @returns ToolCategory ('git.read' or 'git.write')
     */
    private getGitCategory;
    /**
     * Executes a git operation with full security pipeline
     * @param request - The execution request
     * @returns Git execution result
     */
    execute(request: GitExecutionRequest): Promise<GitExecutionResult>;
    /**
     * Builds git command arguments
     * @param request - The execution request
     * @returns Array of git arguments
     */
    private buildGitArgs;
    /**
     * Executes a git command using child_process.spawn()
     * @param command - The command to execute
     * @param args - Command arguments
     * @param cwd - Working directory
     * @param signal - AbortSignal for timeout
     * @returns Output from the command
     */
    private executeGitCommand;
    /**
     * Gets the audit emitter
     * @returns ShellAuditEmitter instance
     */
    getAuditEmitter(): ShellAuditEmitter;
}
//# sourceMappingURL=executor.d.ts.map