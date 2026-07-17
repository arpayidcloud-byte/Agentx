/**
 * @module approval/approval-audit
 * @description Approval audit logging and event tracking.
 * Records all approval lifecycle events for observability.
 */
import { ApprovalAuditEvent } from './interfaces.js';
/**
 * Approval audit logger
 */
export declare class ApprovalAuditLogger {
    private events;
    /**
     * Logs an approval audit event
     * @param event - The audit event to log
     */
    log(event: ApprovalAuditEvent): void;
    /**
     * Gets all logged events
     * @returns Array of audit events
     */
    getEvents(): ApprovalAuditEvent[];
    /**
     * Gets events filtered by type
     * @param eventType - Event type to filter
     * @returns Filtered events
     */
    getEventsByType(eventType: string): ApprovalAuditEvent[];
    /**
     * Gets events for a specific request
     * @param requestId - Request ID to filter
     * @returns Filtered events
     */
    getEventsByRequest(requestId: string): ApprovalAuditEvent[];
    /**
     * Gets events for a specific task
     * @param taskId - Task ID to filter
     * @returns Filtered events
     */
    getEventsByTask(taskId: string): ApprovalAuditEvent[];
    /**
     * Clears all events
     */
    clear(): void;
}
//# sourceMappingURL=approval-audit.d.ts.map