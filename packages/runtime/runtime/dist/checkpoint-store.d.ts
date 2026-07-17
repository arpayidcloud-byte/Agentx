/**
 * @module runtime/checkpoint-store
 * @description Abstract checkpoint store interface and memory implementation.
 */
export interface Checkpoint {
    id: string;
    workflowId: string;
    snapshot: Record<string, unknown>;
    createdAt: Date;
    version: number;
    checksum: string;
    metadata: Record<string, unknown>;
}
export interface ICheckpointStore {
    save(checkpoint: Checkpoint): Promise<Checkpoint>;
    load(workflowId: string): Promise<Checkpoint | undefined>;
    list(workflowId: string): Promise<Checkpoint[]>;
    delete(checkpointId: string): Promise<void>;
}
export declare class MemoryCheckpointStore implements ICheckpointStore {
    private checkpoints;
    save(checkpoint: Checkpoint): Promise<Checkpoint>;
    load(workflowId: string): Promise<Checkpoint | undefined>;
    list(workflowId: string): Promise<Checkpoint[]>;
    delete(checkpointId: string): Promise<void>;
}
//# sourceMappingURL=checkpoint-store.d.ts.map