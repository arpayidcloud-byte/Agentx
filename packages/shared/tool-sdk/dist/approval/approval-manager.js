/**
 * @module approval/approval-manager
 * @description Approval manager for coordinating approval workflows.
 * Manages approval sessions, expiration checks, and lifecycle.
 */
import { ApprovalService } from './approval-service.js';
import { createApprovalSession, isSessionValid, addRequestToSession, deactivateSession, } from './approval-session.js';
/**
 * Approval manager coordinating the full approval workflow
 */
export class ApprovalManager {
    service;
    sessions = new Map();
    constructor() {
        this.service = new ApprovalService();
    }
    /**
     * Creates an approval request within a session
     * @param params - Creation parameters
     * @param operatorId - Operator ID for the session
     * @returns ApprovalRequest
     */
    async createRequest(params, operatorId) {
        // Get or create session
        let session = this.getActiveSession(operatorId);
        if (!session) {
            session = createApprovalSession(operatorId);
            this.sessions.set(session.id, session);
        }
        // Create the request
        const request = await this.service.createRequest(params);
        // Add to session
        const updatedSession = addRequestToSession(session, request.id);
        this.sessions.set(session.id, updatedSession);
        return request;
    }
    /**
     * Approves a request
     * @param requestId - Request ID
     * @param operatorId - Operator ID
     * @param confirmed - Whether double confirmation is given
     * @returns ApprovalResult
     */
    async approve(requestId, operatorId, confirmed) {
        return this.service.approve(requestId, operatorId, confirmed);
    }
    /**
     * Rejects a request
     * @param requestId - Request ID
     * @param operatorId - Operator ID
     * @param reason - Rejection reason
     * @returns ApprovalResult
     */
    async reject(requestId, operatorId, reason) {
        return this.service.reject(requestId, operatorId, reason);
    }
    /**
     * Cancels a request
     * @param requestId - Request ID
     * @param operatorId - Operator ID
     * @returns ApprovalResult
     */
    async cancel(requestId, operatorId) {
        return this.service.cancel(requestId, operatorId);
    }
    /**
     * Checks for expired requests
     * @returns Array of expired request IDs
     */
    async checkExpirations() {
        const expired = [];
        // Check all waiting requests for expiration
        for (const session of this.sessions.values()) {
            if (!isSessionValid(session)) {
                // Deactivate expired sessions
                const deactivated = deactivateSession(session);
                this.sessions.set(session.id, deactivated);
            }
        }
        return expired;
    }
    /**
     * Gets the active session for an operator
     * @param operatorId - Operator ID
     * @returns Active session or undefined
     */
    getActiveSession(operatorId) {
        for (const session of this.sessions.values()) {
            if (session.operatorId === operatorId && isSessionValid(session)) {
                return session;
            }
        }
        return undefined;
    }
    /**
     * Gets the underlying service
     * @returns ApprovalService
     */
    getService() {
        return this.service;
    }
}
//# sourceMappingURL=approval-manager.js.map