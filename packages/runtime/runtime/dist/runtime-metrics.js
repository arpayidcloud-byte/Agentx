/**
 * @module runtime/runtime-metrics
 * @description Runtime metrics collection and aggregation.
 */
import { createEmptyMetrics } from './runtime-session.js';
export class MetricsCollector {
    metrics;
    startTime = 0;
    constructor() {
        this.metrics = createEmptyMetrics();
    }
    /**
     * Starts timing
     */
    startTiming() {
        this.startTime = Date.now();
    }
    /**
     * Records execution time
     */
    recordExecutionTime() {
        if (this.startTime > 0) {
            this.metrics.executionTimeMs = Date.now() - this.startTime;
        }
    }
    /**
     * Records workflow time
     */
    recordWorkflowTime(durationMs) {
        this.metrics.workflowTimeMs += durationMs;
    }
    /**
     * Records planning time
     */
    recordPlanningTime(durationMs) {
        this.metrics.planningTimeMs += durationMs;
    }
    /**
     * Records approval delay
     */
    recordApprovalDelay(durationMs) {
        this.metrics.approvalDelayMs += durationMs;
    }
    /**
     * Increments tool usage
     */
    incrementToolUsage() {
        this.metrics.toolUsage++;
    }
    /**
     * Increments token usage
     */
    incrementTokenUsage(tokens) {
        this.metrics.tokenUsage += tokens;
    }
    /**
     * Increments provider usage
     */
    incrementProviderUsage() {
        this.metrics.providerUsage++;
    }
    /**
     * Increments retry count
     */
    incrementRetryCount() {
        this.metrics.retryCount++;
    }
    /**
     * Increments checkpoint count
     */
    incrementCheckpointCount() {
        this.metrics.checkpointCount++;
    }
    /**
     * Sets success rate
     */
    setSuccessRate(successful, total) {
        this.metrics.successRate = total > 0 ? successful / total : 0;
    }
    /**
     * Gets current metrics
     * @returns RuntimeMetrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Resets metrics
     */
    reset() {
        this.metrics = {
            executionTimeMs: 0,
            workflowTimeMs: 0,
            planningTimeMs: 0,
            approvalDelayMs: 0,
            agentUtilization: 0,
            parallelism: 0,
            memoryUsageMb: 0,
            tokenUsage: 0,
            providerUsage: 0,
            toolUsage: 0,
            successRate: 0,
            retryCount: 0,
            checkpointCount: 0,
            queueWaitMs: 0,
            criticalPathLength: 0,
            estimatedCostUsd: 0,
        };
    }
}
//# sourceMappingURL=runtime-metrics.js.map