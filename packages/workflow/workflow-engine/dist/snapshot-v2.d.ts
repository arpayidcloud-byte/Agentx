/**
 * @module workflow-engine/snapshot-v2
 * @description Extended snapshot with versioning.
 */
import type { VersionedExecutionSnapshot } from './interfaces-v2.js';
export declare function createVersionedSnapshot(workflowId: string, nodeStates: Map<string, any>, results: Map<string, any>, version: number, createdBy: string): VersionedExecutionSnapshot;
export declare function computeChecksum(snapshot: VersionedExecutionSnapshot): string;
export declare function validateSnapshotChecksum(snapshot: VersionedExecutionSnapshot): boolean;
//# sourceMappingURL=snapshot-v2.d.ts.map