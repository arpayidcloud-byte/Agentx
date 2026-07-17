/**
 * @module approval/approval-validator
 * @description Approval request validation logic.
 * Validates requests before creation and approval actions.
 */
import { ApprovalValidationError } from './errors.js';
/**
 * Approval validator implementation
 */
export class ApprovalValidator {
    /** @inheritdoc */
    validateCreation(request) {
        const errors = [];
        if (!request.category) {
            errors.push('Category is required');
        }
        if (!request.operation) {
            errors.push('Operation is required');
        }
        if (request.riskScore === undefined || request.riskScore < 0 || request.riskScore > 100) {
            errors.push('Risk score must be between 0 and 100');
        }
        if (!request.taskId) {
            errors.push('Task ID is required');
        }
        if (!request.traceId) {
            errors.push('Trace ID is required');
        }
        if (!request.agentRole) {
            errors.push('Agent role is required');
        }
        if (errors.length > 0) {
            throw new ApprovalValidationError(errors.join(', '));
        }
        return true;
    }
    /** @inheritdoc */
    validateAction(request, action) {
        // Check if request is in a valid state for the action
        const validStates = {
            approve: ['WAITING'],
            reject: ['WAITING'],
            cancel: ['WAITING'],
        };
        const valid = validStates[action];
        if (!valid || !valid.includes(request.state)) {
            throw new ApprovalValidationError(`Cannot ${action} request '${request.id}' in state '${request.state}'`);
        }
        return true;
    }
    /**
     * Validates if an approval action is allowed
     * @param request - The approval request
     * @param action - The action to perform
     * @returns true if valid
     */
    isActionAllowed(request, action) {
        try {
            return this.validateAction(request, action);
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=approval-validator.js.map