/**
 * @module shell/audit
 * @description Audit event emitter for shell execution.
 * Implements audit trail for tool.invoked, tool.finished, tool.failed events.
 * Follows Volume 2 Event Bus patterns and Volume 13 Observability requirements.
 */
import { ShellAuditEvent, ToolCategory } from './interfaces.js';
/**
 * In-memory audit emitter for shell execution events
 */
export declare class ShellAuditEmitter {
    private events;
    /**
     * Emit an audit event
     * @param event - The audit event to emit
     */
    emit(event: ShellAuditEvent): void;
    /**
     * Get all emitted events
     * @returns Array of audit events
     */
    getEvents(): ShellAuditEvent[];
    /**
     * Get events filtered by type
     * @param eventType - The event type to filter
     * @returns Filtered audit events
     */
    getEventsByType(eventType: ShellAuditEvent['eventType']): ShellAuditEvent[];
    /**
     * Get events for a specific task
     * @param taskId - The task ID to filter
     * @returns Filtered audit events
     */
    getEventsByTask(taskId: string): ShellAuditEvent[];
    /**
     * Clear all events
     */
    clear(): void;
}
/**
 * Creates a shell invoked audit event
 */
export declare function createToolInvokedEvent(command: string, category: ToolCategory, taskId: string, traceId: string, agentRole: string): ShellAuditEvent;
/**
 * Creates a shell finished audit event
 */
export declare function createToolFinishedEvent(command: string, category: ToolCategory, exitCode: number, durationMs: number, stdoutLength: number, stderrLength: number, taskId: string, traceId: string, agentRole: string, timedOut?: boolean): ShellAuditEvent;
/**
 * Creates a shell failed audit event
 */
export declare function createToolFailedEvent(command: string, category: ToolCategory, taskId: string, traceId: string, agentRole: string, _reason: string): ShellAuditEvent;
//# sourceMappingURL=audit.d.ts.map