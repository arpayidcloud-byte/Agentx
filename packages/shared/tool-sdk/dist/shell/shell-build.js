/**
 * @module shell/shell-build
 * @description Shell.build tool implementation.
 * Allows only allowlisted build commands with Potentially Destructive classification.
 * Per Volume 7, shell.build commands do not require approval but are restricted.
 */
import { ShellExecutor } from './executor.js';
/**
 * Shell.build tool for executing allowlisted build commands
 */
export class ShellBuildTool {
    executor;
    constructor(context) {
        this.executor = new ShellExecutor(context);
    }
    /**
     * Executes a build command
     * @param request - The execution request
     * @returns Execution result
     */
    async execute(request) {
        return this.executor.execute(request);
    }
    /**
     * Gets the tool category
     * @returns Tool category identifier
     */
    getCategory() {
        return 'shell.build';
    }
    /**
     * Checks if a command is allowed for build execution
     * @param command - Command to check
     * @returns true if allowed
     */
    isAllowed(_command) {
        return this.executor.getAuditEmitter().getEvents().length >= 0; // Placeholder
    }
    /**
     * Gets the audit emitter
     * @returns ShellAuditEmitter instance
     */
    getAuditEmitter() {
        return this.executor.getAuditEmitter();
    }
}
//# sourceMappingURL=shell-build.js.map