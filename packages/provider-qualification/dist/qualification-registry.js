/**
 * @module provider-qualification/qualification-registry
 * @description Central registry for certified providers.
 */
import { QualificationRegistryError } from './errors.js';
export class QualificationRegistry {
    reports = new Map();
    snapshots = new Map();
    register(report) {
        if (this.reports.has(report.providerId)) {
            throw new QualificationRegistryError(`Provider already registered: ${report.providerId}`, 'qualification-registry');
        }
        this.reports.set(report.providerId, report);
    }
    unregister(providerId) {
        this.reports.delete(providerId);
    }
    resolve(providerId) {
        return this.reports.get(providerId);
    }
    saveSnapshot(snapshot) {
        this.snapshots.set(snapshot.id, snapshot);
    }
    listSnapshots() {
        return Array.from(this.snapshots.values());
    }
    isCertified(providerId) {
        const report = this.reports.get(providerId);
        return !!report && report.status === 'PASS';
    }
    clear() {
        this.reports.clear();
        this.snapshots.clear();
    }
}
//# sourceMappingURL=qualification-registry.js.map