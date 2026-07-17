import { ResourceAllocation, ResourceUsage } from './interfaces.js';
export declare class ResourceManager {
    private globalLimits;
    private currentUsage;
    private activeAgents;
    constructor(globalLimits: ResourceAllocation);
    registerAgent(agentId: string, requestedAllocation: ResourceAllocation): void;
    unregisterAgent(agentId: string): void;
    recordUsage(usage: Partial<ResourceUsage>): void;
    getIdleAgentsCount(poolTotal: number): number;
    getBusyAgentsCount(): number;
}
//# sourceMappingURL=resource-manager.d.ts.map