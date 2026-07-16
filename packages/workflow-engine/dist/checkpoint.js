/**
 * @module workflow-engine/checkpoint
 * @description Checkpoint management for workflow state persistence.
 */
import { SnapshotError } from './errors.js';
/**
 * In-memory checkpoint manager
 */
export class InMemoryCheckpointManager {
    checkpoints = new Map();
    /** @inheritdoc */
    async save(snapshot) {
        const checkpoint = {
            id: `cp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            workflowId: snapshot.workflowId,
            snapshot: { ...snapshot },
            createdAt: new Date(),
        };
        const existing = this.checkpoints.get(snapshot.workflowId) || [];
        existing.push(checkpoint);
        this.checkpoints.set(snapshot.workflowId, existing);
        return checkpoint;
    }
    /** @inheritdoc */
    async load(workflowId) {
        const list = this.checkpoints.get(workflowId);
        if (!list || list.length === 0)
            return undefined;
        return list[list.length - 1];
    }
    /** @inheritdoc */
    async list(workflowId) {
        return this.checkpoints.get(workflowId) || [];
    }
    /** @inheritdoc */
    async delete(checkpointId) {
        for (const [workflowId, list] of this.checkpoints.entries()) {
            const filtered = list.filter(cp => cp.id !== checkpointId);
            if (filtered.length < list.length) {
                this.checkpoints.set(workflowId, filtered);
                return;
            }
        }
        throw new SnapshotError(`Checkpoint not found: ${checkpointId}`);
    }
}
/**
 * Creates an execution snapshot
 */
export function createSnapshot(workflowId, nodeStates, results, version) {
    return {
        workflowId,
        nodeStates: new Map(nodeStates),
        results: new Map(results),
        timestamp: new Date(),
        version,
    };
}
/**
 * Restores state from snapshot
 */
export function restoreFromSnapshot(snapshot) {
    return {
        nodeStates: new Map(snapshot.nodeStates),
        results: new Map(snapshot.results),
    };
}
//# sourceMappingURL=checkpoint.js.map