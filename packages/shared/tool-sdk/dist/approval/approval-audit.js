/**
 * @module approval/approval-audit
 * @description Approval audit logging and event tracking.
 * Records all approval lifecycle events for observability.
 */
/**
 * Approval audit logger
 */
export class ApprovalAuditLogger {
    events = [];
    /**
     * Logs an approval audit event
     * @param event - The audit event to log
     */
    log(event) {
        this.events.push({
            ...event,
            timestamp: event.timestamp || new Date(),
        });
    }
    /**
     * Gets all logged events
     * @returns Array of audit events
     */
    getEvents() {
        return [...this.events];
    }
    /**
     * Gets events filtered by type
     * @param eventType - Event type to filter
     * @returns Filtered events
     */
    getEventsByType(eventType) {
        return this.events.filter((e) => e.eventType === eventType);
    }
    /**
     * Gets events for a specific request
     * @param requestId - Request ID to filter
     * @returns Filtered events
     */
    getEventsByRequest(requestId) {
        return this.events.filter((e) => e.requestId === requestId);
    }
    /**
     * Gets events for a specific task
     * @param taskId - Task ID to filter
     * @returns Filtered events
     */
    getEventsByTask(taskId) {
        return this.events.filter((e) => e.taskId === taskId);
    }
    /**
     * Clears all events
     */
    clear() {
        this.events = [];
    }
}
//# sourceMappingURL=approval-audit.js.map