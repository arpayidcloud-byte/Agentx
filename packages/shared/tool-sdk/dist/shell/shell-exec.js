/**
 * @module shell/shell-exec
 * @description Shell.exec tool implementation.
 * Executes arbitrary shell commands with full sandboxing.
 * Per ADR-0005, shell.exec is Destructive (Risk 90) and requires approval.
 */
import { ShellExecutor } from './executor.js';
import { ApprovalRequiredError } from './errors.js';
import { classifyCommand } from './approval.js';
import { parseCommand } from './command-parser.js';
/**
 * Shell.exec tool for executing arbitrary shell commands
 */
export class ShellExecTool {
    executor;
    constructor(context) {
        this.executor = new ShellExecutor(context);
    }
    /**
     * Executes a shell command
     * @param request - The execution request
     * @returns Execution result
     * @throws ApprovalRequiredError if approval is required but not granted
     */
    async execute(request) {
        // Parse and classify the command
        const parsed = parseCommand(request.command);
        const approval = classifyCommand(parsed, 'shell.exec');
        // If approval is required, check if it's been granted
        if (approval.requiresApproval) {
            // In v0.1, we reject commands requiring approval
            // The approval gate will be implemented in M2.5
            throw new ApprovalRequiredError(request.command, approval.classification);
        }
        return this.executor.execute(request);
    }
    /**
     * Gets the tool category
     * @returns Tool category identifier
     */
    getCategory() {
        return 'shell.exec';
    }
    /**
     * Gets the audit emitter
     * @returns ShellAuditEmitter instance
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=shell-exec.js.map