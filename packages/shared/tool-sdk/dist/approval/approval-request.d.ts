/**
 * @module approval/approval-request
 * @description Approval request creation and management.
 * Creates and manages approval requests with proper state transitions.
 */
import { ApprovalRequest, ApprovalState, CreateApprovalRequestParams } from './interfaces.js';
/**
 * Generates a unique approval request ID
 * @returns Unique ID string
 */
export declare function generateRequestId(): string;
/**
 * Creates a new approval request from parameters
 * @param params - Creation parameters
 * @returns New ApprovalRequest
 */
export declare function createApprovalRequest(params: CreateApprovalRequestParams): ApprovalRequest;
/**
 * Updates an approval request state
 * @param request - Current request
 * @param newState - New state
 * @param updates - Additional updates
 * @returns Updated request
 */
export declare function updateApprovalRequest(request: ApprovalRequest, newState: ApprovalState, updates?: Partial<ApprovalRequest>): ApprovalRequest;
/**
 * Checks if a request can transition to a new state
 * @param current - Current state
 * @param next - Target state
 * @returns true if transition is valid
 */
export declare function canTransition(current: ApprovalState, next: ApprovalState): boolean;
//# sourceMappingURL=approval-request.d.ts.map