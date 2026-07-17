/**
 * @module coordinator/coordinator-metrics
 * @description Metrics collection and aggregation for the coordinator.
 */
export class CoordinatorMetricsCollector {
    total = 0;
    active = 0;
    completed = 0;
    failed = 0;
    cancelled = 0;
    retries = 0;
    recoveries = 0;
    totalTimeMs = 0;
    totalQueueTimeMs = 0;
    incrementExecutions() {
        this.total++;
        this.active++;
    }
    decrementActive() {
        this.active = Math.max(0, this.active - 1);
    }
    incrementCompleted(timeMs) {
        this.completed++;
        this.decrementActive();
        this.totalTimeMs += timeMs;
    }
    incrementFailed(timeMs) {
        this.failed++;
        this.decrementActive();
        this.totalTimeMs += timeMs;
    }
    incrementCancelled() {
        this.cancelled++;
        this.decrementActive();
    }
    incrementRetries() {
        this.retries++;
    }
    incrementRecoveries() {
        this.recoveries++;
    }
    addQueueTime(timeMs) {
        this.totalQueueTimeMs += timeMs;
    }
    getMetrics() {
        return {
            executionTimeMs: this.totalTimeMs,
            queueTimeMs: this.totalQueueTimeMs,
            totalExecutions: this.total,
            activeExecutions: this.active,
            completedExecutions: this.completed,
            failedExecutions: this.failed,
            cancelledExecutions: this.cancelled,
            retryCount: this.retries,
            recoveryCount: this.recoveries,
        };
    }
    reset() {
        this.total = 0;
        this.active = 0;
        this.completed = 0;
        this.failed = 0;
        this.cancelled = 0;
        this.retries = 0;
        this.recoveries = 0;
        this.totalTimeMs = 0;
        this.totalQueueTimeMs = 0;
    }
}
//# sourceMappingURL=coordinator-metrics.js.map