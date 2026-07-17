/**
 * @module coordinator/coordinator-metrics
 * @description Metrics collection and aggregation for the coordinator.
 */
import { ExecutionCoordinatorMetrics } from './interfaces.js';
export declare class CoordinatorMetricsCollector {
    private total;
    private active;
    private completed;
    private failed;
    private cancelled;
    private retries;
    private recoveries;
    private totalTimeMs;
    private totalQueueTimeMs;
    incrementExecutions(): void;
    decrementActive(): void;
    incrementCompleted(timeMs: number): void;
    incrementFailed(timeMs: number): void;
    incrementCancelled(): void;
    incrementRetries(): void;
    incrementRecoveries(): void;
    addQueueTime(timeMs: number): void;
    getMetrics(): ExecutionCoordinatorMetrics;
    reset(): void;
}
//# sourceMappingURL=coordinator-metrics.d.ts.map