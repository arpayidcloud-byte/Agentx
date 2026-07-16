/**
 * @module shell/shell-build
 * @description Shell.build tool implementation.
 * Allows only allowlisted build commands with Potentially Destructive classification.
 * Per Volume 7, shell.build commands do not require approval but are restricted.
 */
import { ShellExecutionRequest, ShellExecutionResult, ShellExecutionContext, ToolCategory } from './interfaces.js';
/**
 * Shell.build tool for executing allowlisted build commands
 */
export declare class ShellBuildTool {
    private executor;
    constructor(context: ShellExecutionContext);
    /**
     * Executes a build command
     * @param request - The execution request
     * @returns Execution result
     */
    execute(request: ShellExecutionRequest): Promise<ShellExecutionResult>;
    /**
     * Gets the tool category
     * @returns Tool category identifier
     */
    getCategory(): ToolCategory;
    /**
     * Checks if a command is allowed for build execution
     * @param command - Command to check
     * @returns true if allowed
     */
    isAllowed(_command: string): boolean;
    /**
     * Gets the audit emitter
     * @returns ShellAuditEmitter instance
     */
    getAuditEmitter(): import("./audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=shell-build.d.ts.map