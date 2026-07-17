/**
 * @module workflow-engine/executor
 * @description WorkflowExecutor separates orchestration from execution.
 */
import { NodeExecutor } from './node-executor.js';
import { ExecutionPlanner } from './planner.js';
import { RetryCoordinator } from './retry.js';
import { InMemoryCheckpointManager } from './checkpoint.js';
export class WorkflowExecutor {
    nodeExecutor;
    planner;
    retryCoordinator;
    checkpointManager;
    hooks = [];
    constructor() {
        this.nodeExecutor = new NodeExecutor();
        this.planner = new ExecutionPlanner();
        this.retryCoordinator = new RetryCoordinator();
        this.checkpointManager = new InMemoryCheckpointManager();
    }
    addHook(hook) {
        this.hooks.push(hook);
    }
    async executeWorkflow(workflow, onStateChange) {
        const plan = this.planner.plan(workflow);
        for (const hook of this.hooks) {
            if (hook.beforeWorkflow)
                await hook.beforeWorkflow(workflow);
        }
        onStateChange('RUNNING');
        const startTime = Date.now();
        const nodeStates = new Map();
        const results = new Map();
        const history = [];
        let completedCount = 0;
        let failedCount = 0;
        let approvalCount = 0;
        let toolCalls = 0;
        let agentCalls = 0;
        for (const node of workflow.nodes) {
            nodeStates.set(node.id, 'PENDING');
        }
        for (const batch of plan.batches) {
            const batchPromises = batch.nodeIds.map(async (nodeId) => {
                const node = workflow.nodes.find((n) => n.id === nodeId);
                if (!node)
                    return;
                const nodeStart = Date.now();
                nodeStates.set(node.id, 'RUNNING');
                for (const hook of this.hooks) {
                    if (hook.beforeNode)
                        await hook.beforeNode(node);
                }
                const timelineEntry = {
                    nodeId: node.id,
                    nodeName: node.name,
                    nodeType: node.config.type,
                    startedAt: new Date(nodeStart),
                    finishedAt: null,
                    durationMs: 0,
                    retries: 0,
                    status: 'RUNNING',
                };
                try {
                    let result;
                    let retries = 0;
                    let maxRetries = node.retryPolicy?.maxAttempts || 0;
                    while (retries <= maxRetries) {
                        try {
                            result = await this.nodeExecutor.executeNode(node, { workflowId: workflow.id, nodeStates, results });
                            break;
                        }
                        catch (error) {
                            const decision = this.retryCoordinator.shouldRetry(node.id, error instanceof Error ? error : new Error(String(error)), retries);
                            if (!decision.shouldRetry)
                                throw error;
                            retries++;
                            timelineEntry.retries = retries;
                            for (const hook of this.hooks) {
                                if (hook.onRetry)
                                    await hook.onRetry(node, retries);
                            }
                            await new Promise(r => setTimeout(r, Math.min(decision.delayMs, 1000)));
                        }
                    }
                    results.set(node.id, result);
                    nodeStates.set(node.id, 'COMPLETED');
                    completedCount++;
                    if (node.config.type === 'tool')
                        toolCalls++;
                    if (node.config.type === 'agent')
                        agentCalls++;
                    if (node.config.type === 'approval')
                        approvalCount++;
                    timelineEntry.finishedAt = new Date();
                    timelineEntry.durationMs = Date.now() - nodeStart;
                    timelineEntry.status = 'COMPLETED';
                    for (const hook of this.hooks) {
                        if (hook.afterNode)
                            await hook.afterNode(node, result);
                    }
                }
                catch (error) {
                    nodeStates.set(node.id, 'FAILED');
                    failedCount++;
                    timelineEntry.finishedAt = new Date();
                    timelineEntry.durationMs = Date.now() - nodeStart;
                    timelineEntry.status = 'FAILED';
                    for (const hook of this.hooks) {
                        if (hook.onFailure)
                            await hook.onFailure(node, error instanceof Error ? error : new Error(String(error)));
                    }
                }
                history.push(timelineEntry);
            });
            await Promise.all(batchPromises);
            const cp = await this.checkpointManager.save({
                workflowId: workflow.id,
                nodeStates: nodeStates,
                results: results,
                timestamp: new Date(),
                version: 1,
            });
            for (const hook of this.hooks) {
                if (hook.onCheckpoint)
                    await hook.onCheckpoint(cp);
            }
        }
        const totalDurationMs = Date.now() - startTime;
        const completedNodes = Array.from(nodeStates.values()).filter(s => s === 'COMPLETED').length;
        const metrics = {
            workflowId: workflow.id,
            totalNodes: workflow.nodes.length,
            completedNodes,
            failedNodes: failedCount,
            skippedNodes: 0,
            totalDurationMs,
            nodeDurations: new Map(),
            retries: history.reduce((sum, h) => sum + (h.retries || 0), 0),
            errors: failedCount,
            executionTimeMs: totalDurationMs,
            queueTimeMs: 0,
            parallelismLevel: plan.parallelismLevel,
            criticalPathLength: plan.criticalPath.length,
            approvalCount,
            toolCalls,
            agentCalls,
            cancelledNodes: 0,
            checkpointCount: (await this.checkpointManager.list(workflow.id)).length,
            averageNodeTime: completedNodes > 0 ? totalDurationMs / completedNodes : 0,
            resourceUsage: { tokens: 0, costUsd: 0, providers: 0 },
        };
        for (const hook of this.hooks) {
            if (hook.afterWorkflow)
                await hook.afterWorkflow(workflow, metrics);
            if (hook.onMetrics)
                await hook.onMetrics(metrics);
        }
        return metrics;
    }
    getTimeline() {
        return [];
    }
}
//# sourceMappingURL=executor.js.map