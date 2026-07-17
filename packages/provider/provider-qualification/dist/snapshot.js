/**
 * @module provider-qualification/snapshot
 * @description Snapshot manager for immutable historical storage.
 */
import { createHash } from 'crypto';
export class SnapshotManager {
    snapshots = [];
    create(report) {
        const reportJson = JSON.stringify(report);
        const checksum = createHash('sha256').update(reportJson).digest('hex');
        const snapshot = {
            id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            timestamp: new Date(),
            report: Object.freeze(report),
            checksum,
        };
        this.snapshots.push(snapshot);
        return snapshot;
    }
    list() {
        return [...this.snapshots];
    }
    clear() {
        this.snapshots = [];
    }
}
//# sourceMappingURL=snapshot.js.map