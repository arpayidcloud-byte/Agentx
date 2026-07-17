/**
 * @module runtime/checkpoint-store
 * @description Abstract checkpoint store interface and memory implementation.
 */
export class MemoryCheckpointStore {
    checkpoints = new Map();
    async save(checkpoint) {
        const existing = this.checkpoints.get(checkpoint.workflowId) || [];
        existing.push(checkpoint);
        this.checkpoints.set(checkpoint.workflowId, existing);
        return checkpoint;
    }
    async load(workflowId) {
        const list = this.checkpoints.get(workflowId);
        if (!list || list.length === 0)
            return undefined;
        return list[list.length - 1];
    }
    async list(workflowId) {
        return this.checkpoints.get(workflowId) || [];
    }
    async delete(checkpointId) {
        for (const [wfId, list] of this.checkpoints.entries()) {
            const filtered = list.filter(cp => cp.id !== checkpointId);
            if (filtered.length < list.length) {
                this.checkpoints.set(wfId, filtered);
                return;
            }
        }
    }
}
//# sourceMappingURL=checkpoint-store.js.map