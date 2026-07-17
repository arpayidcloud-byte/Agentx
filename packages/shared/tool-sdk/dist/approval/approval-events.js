/**
 * @module approval/approval-events
 * @description Approval event emission for EventBus integration.
 * Implements audit trail for approval lifecycle events.
 */
/**
 * Creates an approval audit event
 * @param eventType - The event type
 * @param request - The approval request
 * @param durationMs - Optional duration
 * @returns ApprovalAuditEvent
 */
export function createApprovalAuditEvent(eventType, request, durationMs) {
    return {
        eventType,
        requestId: request.id,
        state: request.state,
        category: request.category,
        operation: request.operation,
        riskScore: request.riskScore,
        riskLevel: request.riskLevel,
        operatorId: request.approvedBy,
        rejectionReason: request.rejectionReason,
        taskId: request.taskId,
        traceId: request.traceId,
        agentRole: request.agentRole,
        durationMs,
        timestamp: new Date(),
    };
}
/**
 * Creates an approval created event
 */
export function createApprovalCreatedEvent(request) {
    return createApprovalAuditEvent('approval.created', request);
}
/**
 * Creates an approval approved event
 */
export function createApprovalApprovedEvent(request) {
    return createApprovalAuditEvent('approval.approved', request);
}
/**
 * Creates an approval rejected event
 */
export function createApprovalRejectedEvent(request) {
    return createApprovalAuditEvent('approval.rejected', request);
}
/**
 * Creates an approval cancelled event
 */
export function createApprovalCancelledEvent(request) {
    return createApprovalAuditEvent('approval.cancelled', request);
}
/**
 * Creates an approval expired event
 */
export function createApprovalExpiredEvent(request) {
    return createApprovalAuditEvent('approval.expired', request);
}
/**
 * Creates an approval executed event
 */
export function createApprovalExecutedEvent(request, durationMs) {
    return createApprovalAuditEvent('approval.executed', request, durationMs);
}
/**
 * Creates an approval failed event
 */
export function createApprovalFailedEvent(request) {
    return createApprovalAuditEvent('approval.failed', request);
}
//# sourceMappingURL=approval-events.js.map