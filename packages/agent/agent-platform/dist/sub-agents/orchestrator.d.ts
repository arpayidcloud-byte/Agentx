import type { IMultiAgentOrchestrator, ResourceAllocation } from './interfaces.js';
import type { IEventBus } from '@agentx/core-runtime';
export declare class MultiAgentOrchestrator implements IMultiAgentOrchestrator {
    private splitter;
    private dependencyAnalyzer;
    private pool;
    private runner;
    private bus;
    private resourceManager;
    private heartbeatMonitor;
    private collaborationEngine;
    private activeSessions;
    private workflows;
    constructor(globalEventBus: IEventBus);
    createWorkflow(goal: string, budget: ResourceAllocation): Promise<string>;
    decomposeTask(_workflowId: string): Promise<void>;
    allocateAgents(workflowId: string): Promise<void>;
    execute(workflowId: string): Promise<unknown>;
    merge(workflowId: string): Promise<unknown>;
    supervise(_workflowId: string): void;
    recover(workflowId: string, _failedAgentId: string): Promise<void>;
    shutdown(workflowId: string): Promise<void>;
}
//# sourceMappingURL=orchestrator.d.ts.map