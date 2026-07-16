/**
 * @module runtime/runtime
 * @description Main Production Runtime integrating all engines.
 */
import { RuntimeSession, RuntimeMetrics, AuditRecord } from './interfaces.js';
import { BootstrapOptions } from './runtime-bootstrap.js';
import { IEventBus } from '@agentx/core-runtime';
import { IRuntimePipeline } from './runtime-executor.js';
import { ProductionExecutionCoordinator } from './coordinator/index.js';
export declare class Runtime {
    private eventBus;
    private lifecycle;
    private executor;
    private supervisor;
    private hookManager;
    private auditStore;
    private metricsCollector;
    private healthChecker;
    private runtimeConfig;
    private sessions;
    private coordinator;
    constructor(eventBus: IEventBus, pipeline: IRuntimePipeline, options?: BootstrapOptions);
    start(): Promise<RuntimeSession>;
    executeGoal(sessionId: string, goal: string, _context?: Record<string, unknown>): Promise<unknown>;
    pause(): void;
    resume(): void;
    cancel(): void;
    getMetrics(): RuntimeMetrics;
    getHealthStatus(): import("./interfaces.js").HealthStatus[];
    getAuditRecords(): AuditRecord[];
    getSession(sessionId: string): RuntimeSession | undefined;
    addHook(hook: any): void;
    getState(): string;
    getCoordinator(): ProductionExecutionCoordinator;
}
//# sourceMappingURL=runtime.d.ts.map