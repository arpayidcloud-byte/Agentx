/**
 * @module runtime/runtime-observability
 * @description Observability integration for all engines.
 */
import { IAuditStore } from './audit-store.js';
export interface ObservabilityMetrics {
    runtime: {
        executionTimeMs: number;
        sessionCount: number;
        activeSessions: number;
    };
    workflow: {
        totalWorkflows: number;
        completedWorkflows: number;
        failedWorkflows: number;
    };
    tool: {
        totalCalls: number;
        successfulCalls: number;
        failedCalls: number;
        averageExecutionTimeMs: number;
    };
    agent: {
        totalInvocations: number;
        activeAgents: number;
        averageCompletionTimeMs: number;
    };
    approval: {
        totalRequests: number;
        approvedCount: number;
        rejectedCount: number;
        expiredCount: number;
        averageDelayMs: number;
    };
    memory: {
        totalEntries: number;
        hitRate: number;
        avgImportance: number;
    };
    planning: {
        totalPlans: number;
        averageTaskCount: number;
        averageRiskScore: number;
    };
    knowledge: {
        totalDocuments: number;
        totalNodes: number;
        averageConfidence: number;
    };
    context: {
        totalContexts: number;
        averageTokens: number;
        compressionRatio: number;
    };
    health: {
        overallHealthy: boolean;
        componentCount: number;
        unhealthyCount: number;
    };
}
export declare class ObservabilityManager {
    private auditStore;
    private metrics;
    constructor(auditStore: IAuditStore);
    private createDefaultMetrics;
    getAggregatedMetrics(): Promise<ObservabilityMetrics>;
    updateRuntimeMetrics(executionTimeMs: number, sessionCount: number, activeSessions: number): void;
    updateWorkflowMetrics(total: number, completed: number, failed: number): void;
    updateToolMetrics(total: number, successful: number, failed: number, avgTime: number): void;
    updateAgentMetrics(total: number, active: number, avgTime: number): void;
    updateApprovalMetrics(total: number, approved: number, rejected: number, expired: number, avgDelay: number): void;
    updateHealthMetrics(healthy: boolean, componentCount: number, unhealthy: number): void;
}
//# sourceMappingURL=runtime-observability.d.ts.map