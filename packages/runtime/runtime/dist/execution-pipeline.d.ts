/**
 * @module runtime/execution-pipeline
 * @description Production execution pipeline integrating all engines.
 */
import type { RuntimeConfig } from './interfaces.js';
import type { IAuditStore, AuditRecord } from './audit-store.js';
export interface PipelineResult {
    success: boolean;
    output: unknown;
    metrics: {
        executionTimeMs: number;
        workflowTimeMs: number;
        planningTimeMs: number;
        approvalDelayMs: number;
        toolCalls: number;
        agentCalls: number;
        tokenUsage: number;
        estimatedCostUsd: number;
    };
    audit: AuditRecord;
}
export declare class ExecutionPipeline {
    private auditStore;
    private config;
    constructor(auditStore: IAuditStore, config: RuntimeConfig);
    getConfig(): RuntimeConfig;
    execute(session: {
        id: string;
        traceId: string;
        goal: string;
    }, _context?: Record<string, unknown>): Promise<PipelineResult>;
}
//# sourceMappingURL=execution-pipeline.d.ts.map