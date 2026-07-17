/**
 * @module git/audit
 * @description Audit event emitter for git operations.
 * Follows Volume 2 Event Bus patterns and Volume 13 Observability requirements.
 */
import { GitAuditEvent, GitOperation } from './interfaces.js';
import { ShellAuditEmitter } from '../shell/audit.js';
/**
 * Git-specific audit emitter
 */
export declare class GitAuditEmitter extends ShellAuditEmitter {
    /**
     * Emit a git-specific audit event
     * @param event - The git audit event
     */
    emitGitEvent(event: GitAuditEvent): void;
    /**
     * Get events filtered by git operation
     * @param operation - Git operation to filter
     * @returns Filtered events
     */
    getEventsByOperation(_operation: GitOperation): GitAuditEvent[];
}
/**
 * Creates a git invoked audit event
 */
export declare function createGitInvokedEvent(operation: GitOperation, repository: string, branch: string | undefined, taskId: string, traceId: string, agentRole: string): GitAuditEvent;
/**
 * Creates a git finished audit event
 */
export declare function createGitFinishedEvent(operation: GitOperation, repository: string, branch: string | undefined, commitHash: string | undefined, exitCode: number, durationMs: number, taskId: string, traceId: string, agentRole: string): GitAuditEvent;
/**
 * Creates a git failed audit event
 */
export declare function createGitFailedEvent(operation: GitOperation, repository: string, taskId: string, traceId: string, agentRole: string): GitAuditEvent;
//# sourceMappingURL=audit.d.ts.map