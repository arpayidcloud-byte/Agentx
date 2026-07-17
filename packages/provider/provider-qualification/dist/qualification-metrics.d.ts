/**
 * @module provider-qualification/qualification-metrics
 * @description Operational metrics tracker.
 */
export declare class QualificationMetricsCollector {
    qualifiedProviders: number;
    rejectedProviders: number;
    totalQualificationTimeMs: number;
    totalBenchmarkTimeMs: number;
    totalChaosTimeMs: number;
    averagePerformanceScore: number;
    averageReliabilityScore: number;
    certificationCount: number;
    failureCount: number;
    warningCount: number;
    getMetrics(): Record<string, number>;
    reset(): void;
}
//# sourceMappingURL=qualification-metrics.d.ts.map