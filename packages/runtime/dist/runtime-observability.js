/**
 * @module runtime/runtime-observability
 * @description Observability integration for all engines.
 */
export class ObservabilityManager {
    auditStore;
    metrics;
    constructor(auditStore) {
        this.auditStore = auditStore;
        this.metrics = this.createDefaultMetrics();
    }
    createDefaultMetrics() {
        return {
            runtime: { executionTimeMs: 0, sessionCount: 0, activeSessions: 0 },
            workflow: { totalWorkflows: 0, completedWorkflows: 0, failedWorkflows: 0 },
            tool: { totalCalls: 0, successfulCalls: 0, failedCalls: 0, averageExecutionTimeMs: 0 },
            agent: { totalInvocations: 0, activeAgents: 0, averageCompletionTimeMs: 0 },
            approval: { totalRequests: 0, approvedCount: 0, rejectedCount: 0, expiredCount: 0, averageDelayMs: 0 },
            memory: { totalEntries: 0, hitRate: 0, avgImportance: 0 },
            planning: { totalPlans: 0, averageTaskCount: 0, averageRiskScore: 0 },
            knowledge: { totalDocuments: 0, totalNodes: 0, averageConfidence: 0 },
            context: { totalContexts: 0, averageTokens: 0, compressionRatio: 1 },
            health: { overallHealthy: true, componentCount: 0, unhealthyCount: 0 },
        };
    }
    async getAggregatedMetrics() {
        const records = await this.auditStore.getAll();
        this.metrics.runtime.sessionCount = Math.max(this.metrics.runtime.sessionCount, records.length);
        this.metrics.runtime.activeSessions = Math.max(this.metrics.runtime.activeSessions, records.filter(r => r.result === 'success').length);
        return { ...this.metrics };
    }
    updateRuntimeMetrics(executionTimeMs, sessionCount, activeSessions) {
        this.metrics.runtime = { executionTimeMs, sessionCount, activeSessions };
    }
    updateWorkflowMetrics(total, completed, failed) {
        this.metrics.workflow = { totalWorkflows: total, completedWorkflows: completed, failedWorkflows: failed };
    }
    updateToolMetrics(total, successful, failed, avgTime) {
        this.metrics.tool = { totalCalls: total, successfulCalls: successful, failedCalls: failed, averageExecutionTimeMs: avgTime };
    }
    updateAgentMetrics(total, active, avgTime) {
        this.metrics.agent = { totalInvocations: total, activeAgents: active, averageCompletionTimeMs: avgTime };
    }
    updateApprovalMetrics(total, approved, rejected, expired, avgDelay) {
        this.metrics.approval = { totalRequests: total, approvedCount: approved, rejectedCount: rejected, expiredCount: expired, averageDelayMs: avgDelay };
    }
    updateHealthMetrics(healthy, componentCount, unhealthy) {
        this.metrics.health = { overallHealthy: healthy, componentCount, unhealthyCount: unhealthy };
    }
}
//# sourceMappingURL=runtime-observability.js.map