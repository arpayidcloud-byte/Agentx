/**
 * @module workflow-engine/checkpoint
 * @description Checkpoint management for workflow state persistence.
 */
import type { ExecutionSnapshot, Checkpoint, ICheckpointManager, NodeState } from './interfaces.js';
/**
 * In-memory checkpoint manager
 */
export declare class InMemoryCheckpointManager implements ICheckpointManager {
    private checkpoints;
    /** @inheritdoc */
    save(snapshot: ExecutionSnapshot): Promise<Checkpoint>;
    /** @inheritdoc */
    load(workflowId: string): Promise<Checkpoint | undefined>;
    /** @inheritdoc */
    list(workflowId: string): Promise<Checkpoint[]>;
    /** @inheritdoc */
    delete(checkpointId: string): Promise<void>;
}
/**
 * Creates an execution snapshot
 */
export declare function createSnapshot(workflowId: string, nodeStates: Map<string, NodeState>, results: Map<string, unknown>, version: number): ExecutionSnapshot;
/**
 * Restores state from snapshot
 */
export declare function restoreFromSnapshot(snapshot: ExecutionSnapshot): {
    nodeStates: Map<string, NodeState>;
    results: Map<string, unknown>;
};
//# sourceMappingURL=checkpoint.d.ts.map