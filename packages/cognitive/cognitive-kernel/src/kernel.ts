/**
 * @module cognitive-kernel/kernel
 * @description Master Cognitive Intelligence Kernel (CIK).
 */

import { KernelConfig, SessionMetadata, SessionCheckpoint, EngineContract } from './interfaces.js';
import { KernelLifecycle } from './kernel-lifecycle.js';
import { KernelSupervisor } from './kernel-supervisor.js';
import { KernelScheduler } from './kernel-scheduler.js';
import { KernelDispatcher } from './kernel-dispatcher.js';
import { KernelRegistry } from './kernel-registry.js';
import { KernelFactory } from './kernel-factory.js';
import { KernelCheckpointManager } from './kernel-checkpoint.js';
import { KernelBudgetManager } from './kernel-budget.js';
import { KernelTraceManager } from './kernel-trace.js';
import { KernelMetricsCollector } from './kernel-metrics.js';
import { KernelAuditManager } from './kernel-audit.js';
import { KernelRecoveryManager } from './kernel-recovery.js';
import { KernelHealthMonitor } from './kernel-health.js';
import { KernelHookManager } from './kernel-hooks.js';
import { KernelEventBus } from './kernel-events.js';
import { KernelValidator } from './kernel-validator.js';
import { KernelStatistics } from './kernel-statistics.js';
import { KernelObservability } from './kernel-observability.js';
import { SessionError } from './errors.js';

export class CognitiveKernel {
  public lifecycle = new KernelLifecycle();
  public supervisor = new KernelSupervisor();
  public scheduler = new KernelScheduler();
  public dispatcher = new KernelDispatcher();
  public registry = new KernelRegistry();
  public factory = new KernelFactory();
  public checkpoint = new KernelCheckpointManager();
  public budget = new KernelBudgetManager(100000);
  public trace = new KernelTraceManager();
  public metrics = new KernelMetricsCollector();
  public audit = new KernelAuditManager();
  public recovery = new KernelRecoveryManager();
  public health = new KernelHealthMonitor();
  public hooks = new KernelHookManager();
  public events = new KernelEventBus();
  
  private validator = new KernelValidator();
  private stats = new KernelStatistics(this.metrics);
  private obs = new KernelObservability(this.trace);

  constructor(private config: KernelConfig) {
    this.supervisor.registerComponent('budget', () => this.budget.getSnapshot().globalTokens < 100000);
    this.supervisor.registerComponent('health', () => this.health.getOverallHealth() > 50);
  }

  async start(): Promise<void> {
    this.lifecycle.transition('INITIALIZING');
    this.lifecycle.transition('READY');
    this.events.publish('kernel.ready', { timestamp: new Date() });
  }

  async executeThinking(sessionMeta: SessionMetadata, input: unknown): Promise<unknown> {
    const startTime = Date.now();
    this.validator.validateSession(sessionMeta);

    this.lifecycle.transition('WAITING');
    this.scheduler.schedule(sessionMeta.sessionId);

    this.lifecycle.transition('THINKING');
    this.events.publish('kernel.session.created', { sessionId: sessionMeta.sessionId });
    this.trace.startTrace(sessionMeta.traceId);
    this.audit.log(sessionMeta.traceId, sessionMeta.sessionId, 'start_thinking', { input });
    
    await this.hooks.runBeforeThinking(sessionMeta.sessionId);

    try {
      if (sessionMeta.metadata.fail === true) {
        throw new Error('Forced execution failure');
      }

      this.lifecycle.transition('EXECUTING');
      this.trace.addStep(sessionMeta.traceId, 'DISPATCH');

      const engine = this.registry.resolve('thinking');
      let result = { output: 'default thinking output' };
      
      if (engine) {
        result = await this.dispatcher.dispatch(engine, input) as any;
      }

      this.lifecycle.transition('CHECKPOINTING');
      const checkpoint = this.checkpoint.saveCheckpoint(sessionMeta.sessionId, { result });
      this.metrics.recordCheckpoint();
      
      await this.hooks.runAfterCheckpoint(sessionMeta.sessionId, checkpoint);
      this.events.publish('kernel.checkpoint.saved', { checkpointId: checkpoint.metadata.id });

      this.lifecycle.transition('COMPLETED');
      this.metrics.recordSession(Date.now() - startTime);
      await this.hooks.runAfterThinking(sessionMeta.sessionId, result);
      this.events.publish('kernel.completed', { sessionId: sessionMeta.sessionId, result });
      
      return result;
    } catch (err: any) {
      this.metrics.recordFailure();
      this.lifecycle.transition('FAILED');
      await this.hooks.runOnFailure(sessionMeta.sessionId, err);
      this.events.publish('kernel.failed', { sessionId: sessionMeta.sessionId, error: err.message });
      throw err;
    }
  }

  async recoverSession(sessionId: string): Promise<Record<string, unknown>> {
    this.lifecycle.transition('RECOVERING');
    const checkpoint = this.checkpoint.getCheckpoint(sessionId);
    if (!checkpoint) {
      throw new SessionError('No checkpoint found to recover session', 'kernel');
    }
    await this.hooks.runOnRecovery(sessionId);
    const recovered = this.recovery.recover(checkpoint);
    this.metrics.recordRecovery();
    this.events.publish('kernel.recovered', { sessionId });
    this.lifecycle.transition('WAITING');
    return recovered;
  }

  getStatistics() {
    return this.stats.getStats();
  }

  getObservability() {
    return this.obs;
  }
}
