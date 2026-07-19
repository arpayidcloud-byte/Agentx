/**
 * @module provider-qualification/certification-report
 * @description Builds official report from evaluation.
 */
import type { CertificationReport, QualificationScore, ProviderRank } from './interfaces.js';
export declare class CertificationReportBuilder {
    private qualificationId;
    private providerId;
    private name;
    private version;
    private supportedInterfaces;
    private compatibilityMatrix;
    private scores;
    private rank;
    private timestamp;
    setId(id: string): this;
    setProvider(id: string): this;
    setName(name: string): this;
    setVersion(version: string): this;
    setInterfaces(interfaces: string[]): this;
    setMatrix(matrix: Record<string, boolean>): this;
    setScores(scores: QualificationScore): this;
    setRank(rank: ProviderRank): this;
    build(): CertificationReport;
}
//# sourceMappingURL=certification-report.d.ts.map