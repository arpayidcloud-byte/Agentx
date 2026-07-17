/**
 * @module approval/approval-store
 * @description In-memory approval store implementation.
 * Stores approval requests with state management.
 */
import { IApprovalStore, ApprovalRequest, ApprovalState } from './interfaces.js';
/**
 * In-memory approval store
 */
export declare class InMemoryApprovalStore implements IApprovalStore {
    private requests;
    /** @inheritdoc */
    store(request: ApprovalRequest): Promise<void>;
    /** @inheritdoc */
    retrieve(id: string): Promise<ApprovalRequest | undefined>;
    /** @inheritdoc */
    update(request: ApprovalRequest): Promise<void>;
    /** @inheritdoc */
    delete(id: string): Promise<void>;
    /** @inheritdoc */
    list(): Promise<ApprovalRequest[]>;
    /** @inheritdoc */
    listByState(state: ApprovalState): Promise<ApprovalRequest[]>;
}
//# sourceMappingURL=approval-store.d.ts.map