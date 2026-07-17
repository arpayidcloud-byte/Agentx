/**
 * @module provider-qualification/snapshot
 * @description Snapshot manager for immutable historical storage.
 */
import { QualificationSnapshot, CertificationReport } from './interfaces.js';
export declare class SnapshotManager {
    private snapshots;
    create(report: CertificationReport): QualificationSnapshot;
    list(): QualificationSnapshot[];
    clear(): void;
}
//# sourceMappingURL=snapshot.d.ts.map