/**
 * @module approval/approval-result
 * @description Approval result creation and formatting.
 * Creates and formats approval results for consumption.
 */
import type { ApprovalRequest, ApprovalResult } from './interfaces.js';
/**
 * Creates a successful approval result
 * @param request - The approved request
 * @param doubleConfirmationRequired - Whether double confirmation was required
 * @returns ApprovalResult
 */
export declare function createSuccessResult(request: ApprovalRequest, doubleConfirmationRequired: boolean): ApprovalResult;
/**
 * Creates a rejection result
 * @param request - The rejected request
 * @param reason - Rejection reason
 * @returns ApprovalResult
 */
export declare function createRejectionResult(request: ApprovalRequest, reason?: string): ApprovalResult;
/**
 * Creates an expiration result
 * @param request - The expired request
 * @returns ApprovalResult
 */
export declare function createExpirationResult(request: ApprovalRequest): ApprovalResult;
/**
 * Creates a cancellation result
 * @param request - The cancelled request
 * @returns ApprovalResult
 */
export declare function createCancellationResult(request: ApprovalRequest): ApprovalResult;
//# sourceMappingURL=approval-result.d.ts.map