/**
 * @module shell/shell-exec
 * @description Shell.exec tool implementation.
 * Executes arbitrary shell commands with full sandboxing.
 * Per ADR-0005, shell.exec is Destructive (Risk 90) and requires approval.
 */
import type { ShellExecutionRequest, ShellExecutionResult, ShellExecutionContext, ToolCategory } from './interfaces.js';
/**
 * Shell.exec tool for executing arbitrary shell commands
 */
export declare class ShellExecTool {
    private executor;
    constructor(context: ShellExecutionContext);
    /**
     * Executes a shell command
     * @param request - The execution request
     * @returns Execution result
     * @throws ApprovalRequiredError if approval is required but not granted
     */
    execute(request: ShellExecutionRequest): Promise<ShellExecutionResult>;
    /**
     * Gets the tool category
     * @returns Tool category identifier
     */
    getCategory(): ToolCategory;
    /**
     * Gets the audit emitter
     * @returns ShellAuditEmitter instance
     */
    getAuditEmitter(): import("./audit.js").ShellAuditEmitter;
}
//# sourceMappingURL=shell-exec.d.ts.map