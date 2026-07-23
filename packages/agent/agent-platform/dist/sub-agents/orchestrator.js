import { TaskSplitter, DependencyAnalyzer } from './task-splitter.js';
import { AgentPool } from './agent-pool.js';
import { ParallelRunner } from './parallel-runner.js';
import { MessageBus } from './message-bus.js';
import { ResourceManager } from './resource-manager.js';
import { HeartbeatMonitor } from './heartbeat.js';
import { SubAgentFactory } from './sub-agent-factory.js';
import { MultiAgentCollaborationEngine } from '@agentx/multi-agent-collaboration';
export class MultiAgentOrchestrator {
    splitter;
    dependencyAnalyzer;
    pool;
    runner;
    bus;
    resourceManager;
    heartbeatMonitor;
    collaborationEngine;
    activeSessions = new Map();
    workflows = new Map();
    constructor(globalEventBus) {
        this.splitter = new TaskSplitter();
        this.dependencyAnalyzer = new DependencyAnalyzer();
        const factory = new SubAgentFactory();
        this.pool = new AgentPool({
            minAgents: 1,
            maxAgents: 10,
            idleTimeoutMs: 60000,
            reuseIdleAgents: true,
            spawnStrategy: 'lazy',
        }, factory);
        this.bus = new MessageBus(globalEventBus);
        this.runner = new ParallelRunner(this.pool, this.bus);
        this.resourceManager = new ResourceManager({
            estimatedCpuTimeMs: 100000,
            estimatedMemoryBytes: 1024 * 1024 * 1024, // 1GB
            tokenBudget: 500000,
            costCeilingUsd: 10.0,
            maxConcurrentProviders: 5,
            maxConcurrentTools: 5,
        });
        this.heartbeatMonitor = new HeartbeatMonitor();
        this.collaborationEngine = new MultiAgentCollaborationEngine();
    }
    async createWorkflow(goal, budget) {
        const workflowId = `wf-${Date.now()}`;
        const nodes = this.splitter.decomposeTask(goal, {}, budget);
        this.dependencyAnalyzer.validateGraph(nodes);
        // Start collaboration session for this workflow
        const agentIds = nodes.map((n) => n.task.assignedAgentRole).filter(Boolean);
        const session = await this.collaborationEngine.startSession(goal, agentIds);
        this.activeSessions.set(workflowId, session);
        this.workflows.set(workflowId, {
            nodes,
            completedNodes: new Set(),
            history: [],
            budget,
            sessionId: session.id,
        });
        return workflowId;
    }
    async decomposeTask(_workflowId) {
        // Included in createWorkflow for simplicity in this implementation
    }
    async allocateAgents(workflowId) {
        const wf = this.workflows.get(workflowId);
        if (!wf)
            throw new Error('Workflow not found');
        // Prewarm agents based on graph
        for (const node of wf.nodes) {
            if (node.task.assignedAgentRole) {
                this.pool.prewarm(node.task.assignedAgentRole, 1);
            }
        }
    }
    async execute(workflowId) {
        const wf = this.workflows.get(workflowId);
        if (!wf)
            throw new Error('Workflow not found');
        const executionResults = {};
        let progress = true;
        while (progress && wf.completedNodes.size < wf.nodes.length) {
            progress = false;
            // Find all ready nodes
            const readyNodes = wf.nodes.filter((n) => !wf.completedNodes.has(n.task.id) &&
                n.task.dependsOn.every((dep) => wf.completedNodes.has(dep)));
            if (readyNodes.length > 0) {
                progress = true;
                // Execute ready nodes in parallel
                const promises = readyNodes.map(async (node) => {
                    const agentRole = node.task.assignedAgentRole;
                    this.resourceManager.registerAgent(agentRole, node.estimatedBudget);
                    const result = await this.runner.runParallel(node.task, [agentRole], {});
                    this.resourceManager.unregisterAgent(agentRole);
                    wf.completedNodes.add(node.task.id);
                    executionResults[node.task.id] = result;
                    wf.history.push({
                        timestamp: new Date(),
                        agentId: agentRole,
                        taskId: node.task.id,
                        approvalRequired: false,
                        retries: 0,
                        result: 'success',
                    });
                });
                await Promise.all(promises);
                // Check for conflicts between parallel results and resolve
                if (readyNodes.length > 1 && wf.sessionId) {
                    const agentIds = readyNodes.map((n) => n.task.assignedAgentRole);
                    this.collaborationEngine.resolveConflict(agentIds, 'parallel-execution', 'Auto-resolved: all tasks completed successfully');
                }
            }
        }
        if (wf.completedNodes.size < wf.nodes.length) {
            throw new Error('Workflow stalled - circular dependencies or failed tasks');
        }
        return executionResults;
    }
    async merge(workflowId) {
        const wf = this.workflows.get(workflowId);
        if (!wf)
            throw new Error('Workflow not found');
        // Save checkpoint before merge
        if (wf.sessionId) {
            this.collaborationEngine.saveCheckpoint(wf.sessionId);
        }
        // Dummy merge
        return { status: 'merged', totalTasks: wf.nodes.length };
    }
    supervise(_workflowId) {
        this.heartbeatMonitor.startMonitoring();
    }
    async recover(workflowId, _failedAgentId) {
        const wf = this.workflows.get(workflowId);
        if (!wf || !wf.sessionId)
            return;
        // Attempt recovery using collaboration engine
        const recovered = this.collaborationEngine.recover(wf.sessionId);
        if (recovered) {
            wf.history.push({
                timestamp: new Date(),
                agentId: _failedAgentId,
                taskId: 'recovery',
                approvalRequired: false,
                retries: 1,
                result: 'success',
            });
        }
    }
    async shutdown(workflowId) {
        this.heartbeatMonitor.stopMonitoring();
        // Clean up session
        const wf = this.workflows.get(workflowId);
        if (wf && wf.sessionId) {
            this.activeSessions.delete(wf.sessionId);
        }
        this.workflows.delete(workflowId);
    }
}
//# sourceMappingURL=orchestrator.js.map