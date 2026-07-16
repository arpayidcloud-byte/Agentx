/**
 * @module approval/approval-manager
 * @description Approval manager for coordinating approval workflows.
 * Manages approval sessions, expiration checks, and lifecycle.
 */
import { ApprovalRequest, ApprovalResult, CreateApprovalRequestParams } from './interfaces.js';
import { ApprovalService } from './approval-service.js';
/**
 * Approval manager coordinating the full approval workflow
 */
export declare class ApprovalManager {
    private service;
    private sessions;
    constructor();
    /**
     * Creates an approval request within a session
     * @param params - Creation parameters
     * @param operatorId - Operator ID for the session
     * @returns ApprovalRequest
     */
    createRequest(params: CreateApprovalRequestParams, operatorId: string): Promise<ApprovalRequest>;
    /**
     * Approves a request
     * @param requestId - Request ID
     * @param operatorId - Operator ID
     * @param confirmed - Whether double confirmation is given
     * @returns ApprovalResult
     */
    approve(requestId: string, operatorId: string, confirmed?: boolean): Promise<ApprovalResult>;
    /**
     * Rejects a request
     * @param requestId - Request ID
     * @param operatorId - Operator ID
     * @param reason - Rejection reason
     * @returns ApprovalResult
     */
    reject(requestId: string, operatorId: string, reason?: string): Promise<ApprovalResult>;
    /**
     * Cancels a request
     * @param requestId - Request ID
     * @param operatorId - Operator ID
     * @returns ApprovalResult
     */
    cancel(requestId: string, operatorId: string): Promise<ApprovalResult>;
    /**
     * Checks for expired requests
     * @returns Array of expired request IDs
     */
    checkExpirations(): Promise<string[]>;
    /**
     * Gets the active session for an operator
     * @param operatorId - Operator ID
     * @returns Active session or undefined
     */
    private getActiveSession;
    /**
     * Gets the underlying service
     * @returns ApprovalService
     */
    getService(): ApprovalService;
}
//# sourceMappingURL=approval-manager.d.ts.map