/**
 * @module approval/approval-service
 * @description High-level approval service.
 * Provides a unified API for approval operations.
 */
import type { IApprovalEngine, IApprovalStore, ApprovalRequest, ApprovalResult, CreateApprovalRequestParams } from './interfaces.js';
/**
 * Approval service providing high-level API
 */
export declare class ApprovalService {
    private engine;
    private store;
    constructor(store?: IApprovalStore);
    /**
     * Checks if approval is required for an operation
     * @param riskScore - Risk score (0-100)
     * @returns true if approval is required
     */
    isApprovalRequired(riskScore: number): boolean;
    /**
     * Creates an approval request
     * @param params - Creation parameters
     * @returns ApprovalRequest
     */
    createRequest(params: CreateApprovalRequestParams): Promise<ApprovalRequest>;
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
     * Gets a request by ID
     * @param requestId - Request ID
     * @returns ApprovalRequest or undefined
     */
    getRequest(requestId: string): Promise<ApprovalRequest | undefined>;
    /**
     * Executes an approved request
     * @param requestId - Request ID
     */
    execute(requestId: string): Promise<void>;
    /**
     * Gets the underlying engine
     * @returns IApprovalEngine
     */
    getEngine(): IApprovalEngine;
}
//# sourceMappingURL=approval-service.d.ts.map