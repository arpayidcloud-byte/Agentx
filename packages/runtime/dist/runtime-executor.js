/**
 * @module runtime/runtime-executor
 * @description Runtime executor orchestrating the complete execution pipeline.
 */
import { createAuditRecord, AuditStore } from './runtime-audit.js';
import { MetricsCollector } from './runtime-metrics.js';
import { createRuntimeEvent } from './runtime-events.js';
export class RuntimeExecutor {
    pipeline;
    auditStore;
    metricsCollector;
    events = [];
    constructor(pipeline) {
        this.pipeline = pipeline;
        this.auditStore = new AuditStore();
        this.metricsCollector = new MetricsCollector();
    }
    /**
     * Executes the full pipeline
     */
    async execute(session, _config) {
        this.metricsCollector.startTiming();
        const startAudit = createAuditRecord({
            traceId: session.traceId,
            correlationId: '',
            sessionId: session.traceId,
            workflowId: session.id,
            timestamp: new Date(),
            result: 'success',
        });
        try {
            const result = await this.pipeline.execute(session, {});
            this.metricsCollector.recordExecutionTime();
            const endAudit = createAuditRecord({
                ...startAudit,
                durationMs: this.metricsCollector.getMetrics().executionTimeMs,
                result: 'success',
            });
            this.auditStore.record(endAudit);
            this.events.push(createRuntimeEvent('runtime.finished', session.id, session.traceId, { result }));
            return result;
        }
        catch (error) {
            const errorAudit = createAuditRecord({
                ...startAudit,
                result: 'failure',
                metadata: { error: error instanceof Error ? error.message : String(error) },
            });
            this.auditStore.record(errorAudit);
            this.events.push(createRuntimeEvent('runtime.failed', session.id, session.traceId, { error: String(error) }));
            throw error;
        }
    }
    getAuditStore() { return this.auditStore; }
    getMetricsCollector() { return this.metricsCollector; }
    getEvents() { return [...this.events]; }
}
//# sourceMappingURL=runtime-executor.js.map