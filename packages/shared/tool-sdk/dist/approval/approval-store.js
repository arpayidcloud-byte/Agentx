/**
 * @module approval/approval-store
 * @description In-memory approval store implementation.
 * Stores approval requests with state management.
 */
import { ApprovalNotFoundError } from './errors.js';
/**
 * In-memory approval store
 */
export class InMemoryApprovalStore {
    requests = new Map();
    /** @inheritdoc */
    async store(request) {
        this.requests.set(request.id, { ...request });
    }
    /** @inheritdoc */
    async retrieve(id) {
        return this.requests.get(id);
    }
    /** @inheritdoc */
    async update(request) {
        if (!this.requests.has(request.id)) {
            throw new ApprovalNotFoundError(request.id);
        }
        this.requests.set(request.id, { ...request });
    }
    /** @inheritdoc */
    async delete(id) {
        this.requests.delete(id);
    }
    /** @inheritdoc */
    async list() {
        return Array.from(this.requests.values());
    }
    /** @inheritdoc */
    async listByState(state) {
        return Array.from(this.requests.values()).filter((r) => r.state === state);
    }
}
//# sourceMappingURL=approval-store.js.map