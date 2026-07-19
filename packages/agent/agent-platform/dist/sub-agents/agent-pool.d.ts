import type { AgentPoolConfig, AgentRole, SubAgent } from './interfaces.js';
import type { SubAgentFactory } from './sub-agent-factory.js';
export declare class AgentPool {
    private config;
    private factory;
    private idleAgents;
    private busyAgents;
    constructor(config: AgentPoolConfig, factory: SubAgentFactory);
    acquire(role: AgentRole): SubAgent;
    release(agentId: string): void;
    prewarm(role: AgentRole, count: number): void;
    getTotalAgentsCount(): number;
}
//# sourceMappingURL=agent-pool.d.ts.map