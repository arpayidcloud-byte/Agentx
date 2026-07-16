/**
 * @module shell/executor
 * @description Shell executor that uses child_process.spawn() ONLY.
 * Never uses exec() or execSync() per Volume 7 requirements.
 * Implements complete execution pipeline with sandbox, timeout, resource limits, and audit.
 */
import { ShellExecutionRequest, ShellExecutionResult, ShellExecutionContext } from './interfaces.js';
import { ShellAuditEmitter } from './audit.js';
/**
 * Shell executor with full security pipeline
 */
export declare class ShellExecutor {
    private sandbox;
    private auditEmitter;
    private context;
    constructor(context: ShellExecutionContext);
    /**
     * Executes a shell command with full security pipeline
     * @param request - The execution request
     * @returns Shell execution result
     */
    execute(request: ShellExecutionRequest): Promise<ShellExecutionResult>;
    /**
     * Gets the audit emitter for event access
     * @returns ShellAuditEmitter instance
     */
    getAuditEmitter(): ShellAuditEmitter;
}
//# sourceMappingURL=executor.d.ts.map