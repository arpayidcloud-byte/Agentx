import { ResourceLimitExceededError } from './errors.js';
export class ResourceManager {
    globalLimits;
    currentUsage;
    activeAgents = new Set();
    constructor(globalLimits) {
        this.globalLimits = globalLimits;
        this.currentUsage = {
            cpuTimeMs: 0,
            memoryBytes: 0,
            tokensUsed: 0,
            costUsd: 0,
            activeProviders: 0,
            activeTools: 0,
        };
    }
    registerAgent(agentId, requestedAllocation) {
        if (this.currentUsage.costUsd + requestedAllocation.costCeilingUsd >
            this.globalLimits.costCeilingUsd ||
            this.currentUsage.tokensUsed + requestedAllocation.tokenBudget > this.globalLimits.tokenBudget) {
            throw new ResourceLimitExceededError('Global budget exceeded');
        }
        if (this.currentUsage.activeProviders + requestedAllocation.maxConcurrentProviders >
            this.globalLimits.maxConcurrentProviders) {
            throw new ResourceLimitExceededError('Max concurrent providers exceeded');
        }
        this.activeAgents.add(agentId);
    }
    unregisterAgent(agentId) {
        this.activeAgents.delete(agentId);
    }
    recordUsage(usage) {
        if (usage.cpuTimeMs)
            this.currentUsage.cpuTimeMs += usage.cpuTimeMs;
        if (usage.memoryBytes)
            this.currentUsage.memoryBytes = Math.max(this.currentUsage.memoryBytes, usage.memoryBytes);
        if (usage.tokensUsed)
            this.currentUsage.tokensUsed += usage.tokensUsed;
        if (usage.costUsd)
            this.currentUsage.costUsd += usage.costUsd;
        // Check caps after recording
        if (this.currentUsage.costUsd > this.globalLimits.costCeilingUsd) {
            throw new ResourceLimitExceededError('Cost ceiling exceeded during execution');
        }
    }
    getIdleAgentsCount(poolTotal) {
        return Math.max(0, poolTotal - this.activeAgents.size);
    }
    getBusyAgentsCount() {
        return this.activeAgents.size;
    }
}
//# sourceMappingURL=resource-manager.js.map