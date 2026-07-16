/**
 * @module multi-agent-reasoning/multi-agent-reasoning.test
 * @description Comprehensive tests for M5.7 Multi-Agent Reasoning.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ReasoningOrchestrator,
  CollaborationSessionManager,
  TaskDelegationEngine,
  CollaborationPlanner,
  CollaborationScheduler,
  ConsensusManager,
  DecisionSynthesizer,
  SharedContextManager,
  RecoveryManager,
  AuditTrailManager,
  AgentRegistry,
  AgentDirectory,
  AgentSelectionEngine,
  CollaborationEventBus,
  CollaborationHookManager,
  CollaborationSession,
  TaskDelegation,
  CollaborationCheckpoint,
  AgentMetadata,
  AgentDirectoryEntry,
  ConsensusResult,
  DecisionInput,
  DecisionSynthesizer as DSyn,
  CollaborationError,
  AgentError,
  DelegationError,
  ConsensusError,
  ConflictError as CE,
  SharedMemoryError,
  CircularDelegationError,
  CollaborationHook,
} from '../src/index.js';

const makeAgent = (id: string, capabilities: string[] = ['compute']): AgentMetadata => ({
  id, name: `Agent ${id}`, version: '1.0', capabilities, priority: 5,
});

describe('Collaboration Errors', () => {
  it('instantiates all error types', () => {
    const errs = [AgentError, DelegationError, ConsensusError, CE, SharedMemoryError, CircularDelegationError];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.code).toBeDefined();
      expect(e.src).toBe('src');
    }
    expect(new CollaborationError('msg', 'CODE', 'src').code).toBe('CODE');
    expect(new CollaborationError('msg', 'CODE', 'src').src).toBe('src');
  });

  it('creates error instances with all properties', () => {
    const e1 = new ConsensusError('c-msg', 'c-src');
    expect(e1.code).toBe('CONSENSUS_ERROR');
    expect(e1.src).toBe('c-src');

    const e2 = new CE('co-msg', 'co-src');
    expect(e2.code).toBe('CONFLICT_ERROR');

    const e3 = new SharedMemoryError('s-msg', 's-src');
    expect(e3.code).toBe('SHARED_MEMORY_ERROR');

    const e4 = new CircularDelegationError('cd-msg', 'cd-src');
    expect(e4.code).toBe('CIRCULAR_DELEGATION');
  });
});

describe('AgentRegistry', () => {
  let registry: AgentRegistry;
  beforeEach(() => { registry = new AgentRegistry(); });

  it('registers, heartbeats, and manages agents', () => {
    registry.register(makeAgent('a1'));
    expect(registry.list()).toHaveLength(1);
    registry.heartbeat('a1');
    expect(registry.get('a1')?.status).toBe('ACTIVE');
    registry.unregister('a1');
    expect(registry.list()).toHaveLength(0);
  });

  it('throws on duplicate registration', () => {
    registry.register(makeAgent('a1'));
    expect(() => registry.register(makeAgent('a1'))).toThrow(AgentError);
  });

  it('throws heartbeat on missing agent', () => {
    expect(() => registry.heartbeat('missing')).toThrow(AgentError);
  });

  it('lists registered agents', () => {
    registry.register(makeAgent('a1'));
    registry.register(makeAgent('a2'));
    expect(registry.list()).toHaveLength(2);
  });
});

describe('AgentDirectory', () => {
  let dir: AgentDirectory;
  beforeEach(() => { dir = new AgentDirectory(); });

  it('discovers agents by capabilities', () => {
    dir.register('a1', ['compute', 'gpu'], 5, 2);
    dir.register('a2', ['compute', 'cpu'], 3, 1);
    const match = dir.discover(['compute']);
    expect(match.matchedAgents.length).toBe(2);
    expect(match.matchScore).toBe(100);
    const noMatch = dir.discover(['storage']);
    expect(noMatch.matchScore).toBe(0);
  });

  it('allocates and releases slots', () => {
    dir.register('a1', ['compute'], 5, 1);
    expect(dir.allocate('a1')).toBe(true);
    expect(dir.allocate('a1')).toBe(false);
    dir.release('a1');
    expect(dir.allocate('a1')).toBe(true);
  });

  it('removes agents', () => {
    dir.register('a1', ['compute'], 5, 1);
    dir.unregister('a1');
    expect(dir.discover(['compute']).matchedAgents).toHaveLength(0);
  });

  it('returns all capabilities', () => {
    dir.register('a1', ['a', 'b'], 1, 1);
    dir.register('a2', ['b', 'c'], 2, 1);
    expect(dir.getAllCapabilities().length).toBe(3);
  });
});

describe('AgentSelectionEngine', () => {
  it('selects best candidate by capacity', () => {
    const engine = new AgentSelectionEngine();
    const entries = [
      { agentId: 'a1', capabilities: ['c'], priority: 5, availableSlots: 10, currentLoad: 5 },
      { agentId: 'a2', capabilities: ['c'], priority: 1, availableSlots: 10, currentLoad: 1 },
    ];
    const best = engine.selectBestCandidate(entries, ['c']);
    expect(best?.agentId).toBe('a2');
  });

  it('selects by priority when slots are equal', () => {
    const engine = new AgentSelectionEngine();
    const entries = [
      { agentId: 'a1', capabilities: ['c'], priority: 10, availableSlots: 5, currentLoad: 5 },
      { agentId: 'a2', capabilities: ['c'], priority: 1, availableSlots: 5, currentLoad: 5 },
    ];
    const best = engine.selectBestCandidate(entries, ['c']);
    expect(best?.agentId).toBe('a1');
  });

  it('returns null when no match', () => {
    const engine = new AgentSelectionEngine();
    expect(engine.selectBestCandidate([], ['c'])).toBeNull();
  });
});

describe('CollaborationPlanner', () => {
  it('creates deterministic plans', () => {
    const planner = new CollaborationPlanner();
    const plan = planner.plan('g1', ['a1', 'a2']);
    expect(plan.phases).toContain('planning');
    expect(plan.checksum).toBeDefined();
    expect(plan.agentIds).toEqual(['a1', 'a2']);
  });
});

describe('TaskDelegationEngine', () => {
  it('delegates tasks and detects circular dependencies', () => {
    const engine = new TaskDelegationEngine();
    const d = engine.delegate('t1', 'a1', 'g1', 5);
    expect(d.agentId).toBe('a1');
    expect(d.status).toBe('ASSIGNED');
    expect(engine.getDelegation('t1')).toBeDefined();
    engine.addDependency('t1', 't2');
    expect(engine.detectCycle()).toBe(false);
  });

  it('throws on circular delegation', () => {
    const engine = new TaskDelegationEngine();
    engine.addDependency('t1', 't2');
    expect(() => engine.addDependency('t2', 't1')).toThrow(CircularDelegationError);
    expect(engine.detectCycle()).toBe(false);
  });

  it('returns all delegations', () => {
    const engine = new TaskDelegationEngine();
    engine.delegate('t1', 'a1', 'g1', 5);
    expect(engine.getAllDelegations()).toHaveLength(1);
  });
});

describe('CollaborationScheduler', () => {
  it('queues and dequeues tasks by priority', () => {
    const sched = new CollaborationScheduler();
    const t1 = { taskId: 't1', agentId: 'a1', goalId: 'g1', priority: 1, timeout: 1000, status: 'ASSIGNED' as const, metadata: {} };
    const t2 = { taskId: 't2', agentId: 'a1', goalId: 'g1', priority: 10, timeout: 1000, status: 'ASSIGNED' as const, metadata: {} };
    sched.schedule(t1);
    sched.schedule(t2);
    expect(sched.getQueueSize()).toBe(2);
    expect(sched.dequeue()?.taskId).toBe('t2');
  });
});

describe('ConsensusManager', () => {
  it('reaches consensus', async () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1', 'a2']);
    expect(round.votes['a1']).toBe(false);
    engine.castVote(round.id, 'a1', true);
    engine.castVote(round.id, 'a2', true);
    const result = engine.resolveRound(round.id);
    expect(result.approved).toBe(true);
    expect(engine.getResults()).toHaveLength(1);
  });

  it('handles invalid round and agent', async () => {
    const engine = new ConsensusManager();
    expect(() => engine.castVote('invalid', 'a1', true)).toThrow(ConsensusError);
    expect(() => engine.resolveRound('invalid')).toThrow(ConsensusError);
  });

  it('gets round by id', () => {
    const engine = new ConsensusManager();
    const round = engine.startRound('p1', ['a1']);
    expect(engine.getRound(round.id)).toBeDefined();
    expect(engine.getRound('invalid')).toBeUndefined();
  });
});

describe('DecisionSynthesizer', () => {
  it('synthesizes decisions', () => {
    const synth = new DSyn();
    const decisions: DecisionInput[] = [
      { agentId: 'a1', decision: 'approve', confidence: 0.9 },
      { agentId: 'a2', decision: 'reject', confidence: 0.8 },
    ];
    const output = synth.synthesize(decisions);
    expect(output.averageConfidence).toBe(0.85);
    expect(output.inputs).toHaveLength(2);
  });

  it('handles empty decisions', () => {
    const synth = new DSyn();
    const output = synth.synthesize([]);
    expect(output.synthesizedDecision).toBe('');
    expect(output.inputs).toHaveLength(0);
    expect(output.averageConfidence).toBe(0);
  });

  it('resolves conflicts by confidence', () => {
    const synth = new DSyn();
    const d1 = { agentId: 'a1', decision: 'd1', confidence: 0.8 };
    const d2 = { agentId: 'a2', decision: 'd2', confidence: 0.9 };
    const resolved = synth.resolveConflicts([d1, d2]);
    expect(resolved[0].agentId).toBe('a2');
  });
});

describe('SharedContextManager', () => {
  it('manages shared context', () => {
    const ctx = new SharedContextManager();
    const c = ctx.createContext('s1', { data: 'test' });
    expect(c.version).toBe(1);
    const updated = ctx.updateContext('s1', { data: 'updated' });
    expect(updated.version).toBe(2);
    expect(ctx.getContext('s1')).toBeDefined();
    expect(ctx.getContext('missing')).toBeUndefined();
  });

  it('throws on missing context', () => {
    const ctx = new SharedContextManager();
    expect(() => ctx.updateContext('missing', { data: 'test' })).toThrow();
  });
});

describe('RecoveryManager', () => {
  it('saves and recovers checkpoints', () => {
    const rm = new RecoveryManager();
    const cp = rm.saveCheckpoint('s1', { a1: 'idle' }, { data: 1 });
    expect(cp.checksum).toBeDefined();
    expect(rm.recoverFromCheckpoint('s1')).toBeDefined();
    expect(rm.validateCheckpoint(cp)).toBe(true);
    expect(rm.recoverFromCheckpoint('missing')).toBeUndefined();
  });
});

describe('AuditTrailManager', () => {
  it('logs and verifies audit entries', () => {
    const audit = new AuditTrailManager();
    const entry = audit.log('t1', 's1', 'action', { result: 'ok' });
    expect(entry.checksum).toBeDefined();
    expect(audit.getEntries()).toHaveLength(1);
    expect(audit.verifyIntegrity('s1')).toBe(true);
  });

  it('returns empty for invalid session', () => {
    const audit = new AuditTrailManager();
    expect(audit.verifyIntegrity('invalid')).toBe(true);
  });
});

describe('CollaborationSessionManager', () => {
  it('manages session lifecycle', () => {
    const mgr = new CollaborationSessionManager();
    const session = mgr.createSession('g1', ['a1', 'a2']);
    expect(session.participants).toHaveLength(2);
    mgr.completeSession(session.id);
    expect(mgr.getSession(session.id)?.status).toBe('COMPLETED');
  });

  it('handles fail session', () => {
    const mgr = new CollaborationSessionManager();
    const session = mgr.createSession('g1', ['a1']);
    mgr.failSession(session.id);
    expect(mgr.getSession(session.id)?.status).toBe('FAILED');
  });

  it('lists all sessions', () => {
    const mgr = new CollaborationSessionManager();
    mgr.createSession('g1', ['a1']);
    mgr.createSession('g2', ['a2']);
    expect(mgr.listSessions()).toHaveLength(2);
  });

  it('handles missing session gracefully', () => {
    const mgr = new CollaborationSessionManager();
    mgr.completeSession('missing');
    mgr.failSession('missing');
    expect(mgr.getSession('missing')).toBeUndefined();
  });
});

describe('CollaborationHookManager', () => {
  it('executes all hook types', async () => {
    const hm = new CollaborationHookManager();
    const hook: CollaborationHook = {
      beforeCollaboration: vi.fn(),
      afterCollaboration: vi.fn(),
      beforeDelegation: vi.fn(),
      afterDelegation: vi.fn(),
      beforeConsensus: vi.fn(),
      afterConsensus: vi.fn(),
      beforeRecovery: vi.fn(),
      afterRecovery: vi.fn(),
    };
    hm.register(hook);
    await hm.runBeforeCollaboration('s1');
    await hm.runAfterCollaboration('s1', {});
    await hm.runBeforeDelegation('t1');
    await hm.runAfterDelegation('t1', {});
    await hm.runBeforeConsensus('p1');
    await hm.runAfterConsensus('p1', true);
    await hm.runBeforeRecovery('s1');
    await hm.runAfterRecovery('s1');
    expect(hook.beforeCollaboration).toHaveBeenCalled();
  });

  it('skips hooks with undefined methods', async () => {
    const hm = new CollaborationHookManager();
    hm.register({});
    await hm.runBeforeCollaboration('s1');
    await hm.runAfterCollaboration('s1', {});
    await hm.runBeforeDelegation('t1');
    await hm.runAfterDelegation('t1', {});
    await hm.runBeforeConsensus('p1');
    await hm.runAfterConsensus('p1', true);
    await hm.runBeforeRecovery('s1');
    await hm.runAfterRecovery('s1');
  });
});

describe('CollaborationEventBus', () => {
  it('publishes and subscribes', () => {
    const bus = new CollaborationEventBus();
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.publish('test', {});
    expect(fn).toHaveBeenCalled();
    bus.clear();
  });
});

describe('ReasoningOrchestrator', () => {
  let orchestrator: ReasoningOrchestrator;

  beforeEach(() => { orchestrator = new ReasoningOrchestrator(); });

  it('starts collaboration and executes reasoning', async () => {
    const session = await orchestrator.startCollaboration('g1', ['a1', 'a2']);
    expect(session.status).toBe('ACTIVE');
    const result = await orchestrator.executeReasoning(session);
    expect(result.success).toBe(true);
  });

  it('recovers from checkpoint', () => {
    orchestrator.recoveryManager.saveCheckpoint('s1', { a1: 'idle' }, {});
    expect(orchestrator.recoverSession('s1')).toBe(true);
    expect(orchestrator.recoverSession('missing')).toBe(false);
  });
});
