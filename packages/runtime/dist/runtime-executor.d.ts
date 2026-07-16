/**
 * @module runtime/runtime-executor
 * @description Runtime executor orchestrating the complete execution pipeline.
 */
import { RuntimeConfig } from './interfaces.js';
import { AuditStore } from './runtime-audit.js';
import { MetricsCollector } from './runtime-metrics.js';
import { RuntimeEvent } from './runtime-events.js';
export interface IRuntimePipeline {
    execute(session: any, config: RuntimeConfig): Promise<unknown>;
}
export declare class RuntimeExecutor {
    private pipeline;
    private auditStore;
    private metricsCollector;
    private events;
    constructor(pipeline: IRuntimePipeline);
    /**
     * Executes the full pipeline
     */
    execute(session: any, _config: RuntimeConfig): Promise<unknown>;
    getAuditStore(): AuditStore;
    getMetricsCollector(): MetricsCollector;
    getEvents(): RuntimeEvent[];
}
//# sourceMappingURL=runtime-executor.d.ts.map