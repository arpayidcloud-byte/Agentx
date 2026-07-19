/**
 * @module runtime/runtime-metrics
 * @description Runtime metrics collection and aggregation.
 */
import type { RuntimeMetrics } from './interfaces.js';
export declare class MetricsCollector {
    private metrics;
    private startTime;
    constructor();
    /**
     * Starts timing
     */
    startTiming(): void;
    /**
     * Records execution time
     */
    recordExecutionTime(): void;
    /**
     * Records workflow time
     */
    recordWorkflowTime(durationMs: number): void;
    /**
     * Records planning time
     */
    recordPlanningTime(durationMs: number): void;
    /**
     * Records approval delay
     */
    recordApprovalDelay(durationMs: number): void;
    /**
     * Increments tool usage
     */
    incrementToolUsage(): void;
    /**
     * Increments token usage
     */
    incrementTokenUsage(tokens: number): void;
    /**
     * Increments provider usage
     */
    incrementProviderUsage(): void;
    /**
     * Increments retry count
     */
    incrementRetryCount(): void;
    /**
     * Increments checkpoint count
     */
    incrementCheckpointCount(): void;
    /**
     * Sets success rate
     */
    setSuccessRate(successful: number, total: number): void;
    /**
     * Gets current metrics
     * @returns RuntimeMetrics
     */
    getMetrics(): RuntimeMetrics;
    /**
     * Resets metrics
     */
    reset(): void;
}
//# sourceMappingURL=runtime-metrics.d.ts.map