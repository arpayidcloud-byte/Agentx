/**
 * @module provider-qualification/qualification-metrics
 * @description Operational metrics tracker.
 */
export class QualificationMetricsCollector {
    qualifiedProviders = 0;
    rejectedProviders = 0;
    totalQualificationTimeMs = 0;
    totalBenchmarkTimeMs = 0;
    totalChaosTimeMs = 0;
    averagePerformanceScore = 0;
    averageReliabilityScore = 0;
    certificationCount = 0;
    failureCount = 0;
    warningCount = 0;
    getMetrics() {
        return {
            qualifiedProviders: this.qualifiedProviders,
            rejectedProviders: this.rejectedProviders,
            totalQualificationTimeMs: this.totalQualificationTimeMs,
            totalBenchmarkTimeMs: this.totalBenchmarkTimeMs,
            totalChaosTimeMs: this.totalChaosTimeMs,
            averagePerformanceScore: this.averagePerformanceScore,
            averageReliabilityScore: this.averageReliabilityScore,
            certificationCount: this.certificationCount,
            failureCount: this.failureCount,
            warningCount: this.warningCount,
        };
    }
    reset() {
        this.qualifiedProviders = 0;
        this.rejectedProviders = 0;
        this.totalQualificationTimeMs = 0;
        this.totalBenchmarkTimeMs = 0;
        this.totalChaosTimeMs = 0;
        this.averagePerformanceScore = 0;
        this.averageReliabilityScore = 0;
        this.certificationCount = 0;
        this.failureCount = 0;
        this.warningCount = 0;
    }
}
//# sourceMappingURL=qualification-metrics.js.map