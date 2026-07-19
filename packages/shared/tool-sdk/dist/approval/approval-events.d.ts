/**
 * @module approval/approval-events
 * @description Approval event emission for EventBus integration.
 * Implements audit trail for approval lifecycle events.
 */
import type { ApprovalEventType, ApprovalAuditEvent, ApprovalRequest } from './interfaces.js';
/**
 * Creates an approval audit event
 * @param eventType - The event type
 * @param request - The approval request
 * @param durationMs - Optional duration
 * @returns ApprovalAuditEvent
 */
export declare function createApprovalAuditEvent(eventType: ApprovalEventType, request: ApprovalRequest, durationMs?: number): ApprovalAuditEvent;
/**
 * Creates an approval created event
 */
export declare function createApprovalCreatedEvent(request: ApprovalRequest): ApprovalAuditEvent;
/**
 * Creates an approval approved event
 */
export declare function createApprovalApprovedEvent(request: ApprovalRequest): ApprovalAuditEvent;
/**
 * Creates an approval rejected event
 */
export declare function createApprovalRejectedEvent(request: ApprovalRequest): ApprovalAuditEvent;
/**
 * Creates an approval cancelled event
 */
export declare function createApprovalCancelledEvent(request: ApprovalRequest): ApprovalAuditEvent;
/**
 * Creates an approval expired event
 */
export declare function createApprovalExpiredEvent(request: ApprovalRequest): ApprovalAuditEvent;
/**
 * Creates an approval executed event
 */
export declare function createApprovalExecutedEvent(request: ApprovalRequest, durationMs: number): ApprovalAuditEvent;
/**
 * Creates an approval failed event
 */
export declare function createApprovalFailedEvent(request: ApprovalRequest): ApprovalAuditEvent;
//# sourceMappingURL=approval-events.d.ts.map