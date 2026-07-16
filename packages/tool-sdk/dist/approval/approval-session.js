/**
 * @module approval/approval-session
 * @description Approval session management.
 * Manages operator sessions for approval workflows.
 */
/**
 * Generates a unique session ID
 * @returns Unique session ID string
 */
export function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `session-${timestamp}-${random}`;
}
/**
 * Creates a new approval session
 * @param operatorId - Operator who created the session
 * @param ttlMs - Session TTL in milliseconds (default: 30 minutes)
 * @returns New ApprovalSession
 */
export function createApprovalSession(operatorId, ttlMs = 30 * 60 * 1000) {
    const now = new Date();
    return {
        id: generateSessionId(),
        operatorId,
        startedAt: now,
        expiresAt: new Date(now.getTime() + ttlMs),
        isActive: true,
        requestIds: [],
    };
}
/**
 * Checks if a session is still valid
 * @param session - The session to check
 * @returns true if the session is active and not expired
 */
export function isSessionValid(session) {
    if (!session.isActive)
        return false;
    return Date.now() < session.expiresAt.getTime();
}
/**
 * Adds a request ID to a session
 * @param session - The session to update
 * @param requestId - The request ID to add
 * @returns Updated session
 */
export function addRequestToSession(session, requestId) {
    return {
        ...session,
        requestIds: [...session.requestIds, requestId],
    };
}
/**
 * Deactivates a session
 * @param session - The session to deactivate
 * @returns Deactivated session
 */
export function deactivateSession(session) {
    return {
        ...session,
        isActive: false,
    };
}
//# sourceMappingURL=approval-session.js.map