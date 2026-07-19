/**
 * @module approval/approval-validator
 * @description Approval request validation logic.
 * Validates requests before creation and approval actions.
 */
import type { IApprovalValidator, ApprovalRequest } from './interfaces.js';
/**
 * Approval validator implementation
 */
export declare class ApprovalValidator implements IApprovalValidator {
    /** @inheritdoc */
    validateCreation(request: Partial<ApprovalRequest>): boolean;
    /** @inheritdoc */
    validateAction(request: ApprovalRequest, action: 'approve' | 'reject' | 'cancel'): boolean;
    /**
     * Validates if an approval action is allowed
     * @param request - The approval request
     * @param action - The action to perform
     * @returns true if valid
     */
    isActionAllowed(request: ApprovalRequest, action: 'approve' | 'reject' | 'cancel'): boolean;
}
//# sourceMappingURL=approval-validator.d.ts.map