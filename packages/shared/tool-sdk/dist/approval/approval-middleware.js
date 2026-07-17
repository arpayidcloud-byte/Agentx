/**
 * @module approval/approval-middleware
 * @description Approval middleware for tool execution pipeline.
 * Integrates approval checks into the tool execution flow.
 */
/**
 * Approval middleware implementation
 */
export class ApprovalMiddleware {
    store;
    constructor(store) {
        this.store = store;
    }
    /** @inheritdoc */
    isApprovalRequired(_category, riskScore) {
        // Approval required for risk score >= 40
        return riskScore >= 40;
    }
    /** @inheritdoc */
    async getApprovalStatus(requestId) {
        const request = await this.store.retrieve(requestId);
        return request?.state;
    }
}
//# sourceMappingURL=approval-middleware.js.map