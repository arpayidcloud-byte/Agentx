/**
 * @module coordinator/coordinator
 * @description Main Production Execution Coordinator orchestration engine.
 */
import type { CoordinatorConfig, CoordinatorSession, ExecutionCoordinatorState, ExecutionCoordinatorMetrics, CoordinatorStatistics } from './interfaces.js';
import { CoordinatorAuditLogger } from './coordinator-audit.js';
import { CoordinatorHookManager } from './coordinator-hooks.js';
import { ExecutionScheduler } from './scheduler.js';
import { ExecutionDispatcher } from './dispatcher.js';
import { ExecutionReservationManager } from './reservation.js';
import { ConcurrencyController } from './concurrency.js';
import { CoordinatorRegistry } from './coordinator-registry.js';
import type { IEventBus } from '@agentx/core-runtime';
export declare class ProductionExecutionCoordinator {
    private eventBus;
    private config;
    private stateMachine;
    private metricsCollector;
    private auditLogger;
    private hookManager;
    private scheduler;
    private dispatcher;
    private reservationManager;
    private concurrency;
    private registry;
    private sessions;
    private uptimeStart;
    constructor(eventBus: IEventBus, config: CoordinatorConfig);
    start(): Promise<void>;
    shutdown(): Promise<void>;
    execute(session: CoordinatorSession): Promise<unknown>;
    getState(): ExecutionCoordinatorState;
    getMetrics(): ExecutionCoordinatorMetrics;
    getAuditLogger(): CoordinatorAuditLogger;
    getHookManager(): CoordinatorHookManager;
    getScheduler(): ExecutionScheduler;
    getDispatcher(): ExecutionDispatcher;
    getReservationManager(): ExecutionReservationManager;
    getConcurrencyController(): ConcurrencyController;
    getRegistry(): CoordinatorRegistry;
    getStatistics(): CoordinatorStatistics;
}
//# sourceMappingURL=coordinator.d.ts.map