/**
 * @module approval/approval-engine
 * @description Core approval engine implementation.
 * Manages the full approval lifecycle: create, approve, reject, expire, cancel, execute.
 */
import { IApprovalEngine, IApprovalStore, ApprovalRequest, ApprovalResult, CreateApprovalRequestParams } from './interfaces.js';
import { ApprovalAuditLogger } from './approval-audit.js';
/**
 * Approval engine implementation
 */
export declare class ApprovalEngine implements IApprovalEngine {
    private store;
    private validator;
    private auditLogger;
    constructor(store: IApprovalStore);
    /** @inheritdoc */
    createRequest(params: CreateApprovalRequestParams): Promise<ApprovalRequest>;
    /** @inheritdoc */
    approve(requestId: string, operatorId: string, confirmed?: boolean): Promise<ApprovalResult>;
    /** @inheritdoc */
    reject(requestId: string, operatorId: string, reason?: string): Promise<ApprovalResult>;
    /** @inheritdoc */
    cancel(requestId: string, operatorId: string): Promise<ApprovalResult>;
    /** @inheritdoc */
    getRequest(requestId: string): Promise<ApprovalRequest | undefined>;
    /** @inheritdoc */
    execute(requestId: string): Promise<void>;
    /**
     * Gets the audit logger
     * @returns ApprovalAuditLogger instance
     */
    getAuditLogger(): ApprovalAuditLogger;
}
//# sourceMappingURL=approval-engine.d.ts.map