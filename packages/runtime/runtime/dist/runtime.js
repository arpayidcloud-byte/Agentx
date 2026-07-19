/**
 * @module runtime/runtime
 * @description Main Production Runtime integrating all engines.
 */
import { RuntimeLifecycle } from './runtime-lifecycle.js';
import { RuntimeExecutor } from './runtime-executor.js';
import { RuntimeSupervisor } from './runtime-supervisor.js';
import { RuntimeHookManager } from './runtime-hooks.js';
import { HealthChecker } from './runtime-health.js';
import { createRuntimeSession, createExecutionSession } from './runtime-session.js';
import { createBootstrapConfig } from './runtime-bootstrap.js';
import { RuntimeError } from './errors.js';
import { ProductionExecutionCoordinator } from './coordinator/index.js';
export class Runtime {
    eventBus;
    lifecycle;
    executor;
    supervisor;
    hookManager;
    auditStore;
    metricsCollector;
    healthChecker;
    runtimeConfig;
    sessions = new Map();
    coordinator;
    constructor(eventBus, pipeline, options = {}) {
        this.eventBus = eventBus;
        const bootstrap = createBootstrapConfig(options);
        this.runtimeConfig = bootstrap.config;
        this.lifecycle = new RuntimeLifecycle();
        this.executor = new RuntimeExecutor(pipeline);
        this.supervisor = new RuntimeSupervisor();
        this.hookManager = new RuntimeHookManager();
        this.auditStore = this.executor.getAuditStore();
        this.metricsCollector = this.executor.getMetricsCollector();
        this.healthChecker = new HealthChecker();
        const coordinatorConfig = {
            maxParallelExecutions: 10,
            maxQueueSize: 100,
            defaultTimeoutMs: 60000,
            retryBudget: 3,
            tokenBudget: 500000,
            costBudget: 100.0,
        };
        this.coordinator = new ProductionExecutionCoordinator(eventBus, coordinatorConfig);
    }
    async start() {
        this.lifecycle.transition('INITIALIZING');
        await this.coordinator.start();
        const session = createRuntimeSession('system');
        this.sessions.set(session.id, session);
        this.lifecycle.transition('PLANNING');
        this.lifecycle.transition('RUNNING');
        this.supervisor.start();
        this.metricsCollector.startTiming();
        return session;
    }
    async executeGoal(sessionId, goal, _context = {}) {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new RuntimeError('Session not found', 'SESSION_NOT_FOUND', 'runtime');
        const execSession = createExecutionSession(session.traceId, goal);
        const coordSession = {
            id: sessionId,
            traceId: session.traceId,
            correlationId: session.correlationId,
            goal,
            status: 'ACTIVE',
            startedAt: new Date(),
            metadata: {},
        };
        try {
            await this.coordinator.execute(coordSession);
            const result = await this.executor.execute(execSession, this.runtimeConfig);
            const currentState = this.lifecycle.getState();
            if (currentState === 'RUNNING') {
                this.lifecycle.transition('COMPLETED');
            }
            await this.eventBus.publish('runtime.finished', { sessionId, result }, session.traceId);
            return result;
        }
        catch (error) {
            const currentState = this.lifecycle.getState();
            if (currentState !== 'FAILED' &&
                currentState !== 'COMPLETED' &&
                currentState !== 'CANCELLED') {
                this.lifecycle.transition('FAILED');
            }
            await this.hookManager.executeOnError(session, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
    pause() {
        if (this.lifecycle.getState() === 'RUNNING') {
            this.lifecycle.transition('WAITING_APPROVAL');
            this.supervisor.pause();
        }
    }
    resume() {
        if (this.lifecycle.getState() === 'WAITING_APPROVAL') {
            this.lifecycle.transition('RUNNING');
            this.supervisor.resume();
        }
    }
    cancel() {
        if (this.lifecycle.getState() !== 'COMPLETED' && this.lifecycle.getState() !== 'CANCELLED') {
            this.lifecycle.transition('CANCELLED');
            this.supervisor.stop();
        }
    }
    getMetrics() {
        return this.metricsCollector.getMetrics();
    }
    getHealthStatus() {
        return this.healthChecker.checkAll();
    }
    getAuditRecords() {
        return this.auditStore.getAll();
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    addHook(hook) {
        this.hookManager.register(hook);
    }
    getState() {
        return this.lifecycle.getState();
    }
    getCoordinator() {
        return this.coordinator;
    }
}
//# sourceMappingURL=runtime.js.map