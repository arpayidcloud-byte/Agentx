/**
 * @module approval/approval-middleware
 * @description Approval middleware for tool execution pipeline.
 * Integrates approval checks into the tool execution flow.
 */
import { IApprovalMiddleware, ApprovalState } from './interfaces.js';
import { IApprovalStore } from './interfaces.js';
/**
 * Approval middleware implementation
 */
export declare class ApprovalMiddleware implements IApprovalMiddleware {
    private store;
    constructor(store: IApprovalStore);
    /** @inheritdoc */
    isApprovalRequired(_category: string, riskScore: number): boolean;
    /** @inheritdoc */
    getApprovalStatus(requestId: string): Promise<ApprovalState | undefined>;
}
//# sourceMappingURL=approval-middleware.d.ts.map