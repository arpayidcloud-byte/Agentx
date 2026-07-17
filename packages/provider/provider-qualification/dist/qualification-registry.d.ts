/**
 * @module provider-qualification/qualification-registry
 * @description Central registry for certified providers.
 */
import { CertificationReport, QualificationSnapshot } from './interfaces.js';
export declare class QualificationRegistry {
    private reports;
    private snapshots;
    register(report: CertificationReport): void;
    unregister(providerId: string): void;
    resolve(providerId: string): CertificationReport | undefined;
    saveSnapshot(snapshot: QualificationSnapshot): void;
    listSnapshots(): QualificationSnapshot[];
    isCertified(providerId: string): boolean;
    clear(): void;
}
//# sourceMappingURL=qualification-registry.d.ts.map