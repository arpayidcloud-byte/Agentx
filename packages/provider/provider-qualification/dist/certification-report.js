/**
 * @module provider-qualification/certification-report
 * @description Builds official report from evaluation.
 */
import { createHash } from 'crypto';
export class CertificationReportBuilder {
    qualificationId;
    providerId;
    name;
    version;
    supportedInterfaces;
    compatibilityMatrix;
    scores;
    rank;
    timestamp = new Date();
    setId(id) { this.qualificationId = id; return this; }
    setProvider(id) { this.providerId = id; return this; }
    setName(name) { this.name = name; return this; }
    setVersion(version) { this.version = version; return this; }
    setInterfaces(interfaces) { this.supportedInterfaces = interfaces; return this; }
    setMatrix(matrix) { this.compatibilityMatrix = matrix; return this; }
    setScores(scores) { this.scores = scores; return this; }
    setRank(rank) { this.rank = rank; return this; }
    build() {
        const report = {
            qualificationId: this.qualificationId,
            providerId: this.providerId,
            name: this.name,
            version: this.version,
            supportedInterfaces: this.supportedInterfaces,
            compatibilityMatrix: this.compatibilityMatrix,
            scores: this.scores,
            rank: this.rank,
            status: this.scores.overallScore >= 60 ? 'PASS' : this.scores.overallScore >= 40 ? 'WARNING' : 'FAILED',
            timestamp: this.timestamp,
            checksum: '',
        };
        const content = JSON.stringify(report);
        report.checksum = createHash('sha256').update(content).digest('hex');
        return report;
    }
}
//# sourceMappingURL=certification-report.js.map