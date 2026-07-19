/**
 * @module approval/approval-session
 * @description Approval session management.
 * Manages operator sessions for approval workflows.
 */
import type { ApprovalSession } from './interfaces.js';
/**
 * Generates a unique session ID
 * @returns Unique session ID string
 */
export declare function generateSessionId(): string;
/**
 * Creates a new approval session
 * @param operatorId - Operator who created the session
 * @param ttlMs - Session TTL in milliseconds (default: 30 minutes)
 * @returns New ApprovalSession
 */
export declare function createApprovalSession(operatorId: string, ttlMs?: number): ApprovalSession;
/**
 * Checks if a session is still valid
 * @param session - The session to check
 * @returns true if the session is active and not expired
 */
export declare function isSessionValid(session: ApprovalSession): boolean;
/**
 * Adds a request ID to a session
 * @param session - The session to update
 * @param requestId - The request ID to add
 * @returns Updated session
 */
export declare function addRequestToSession(session: ApprovalSession, requestId: string): ApprovalSession;
/**
 * Deactivates a session
 * @param session - The session to deactivate
 * @returns Deactivated session
 */
export declare function deactivateSession(session: ApprovalSession): ApprovalSession;
//# sourceMappingURL=approval-session.d.ts.map