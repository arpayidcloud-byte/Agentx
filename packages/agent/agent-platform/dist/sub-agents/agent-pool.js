export class AgentPool {
    config;
    factory;
    idleAgents = new Map();
    busyAgents = new Map();
    constructor(config, factory) {
        this.config = config;
        this.factory = factory;
    }
    acquire(role) {
        let agent;
        if (this.config.reuseIdleAgents) {
            const idleList = this.idleAgents.get(role);
            if (idleList && idleList.length > 0) {
                agent = idleList.pop();
            }
        }
        if (!agent) {
            const totalAgents = this.getTotalAgentsCount();
            if (totalAgents >= this.config.maxAgents) {
                throw new Error(`Max agents limit reached (${this.config.maxAgents})`);
            }
            agent = this.factory.createAgent(role);
        }
        this.busyAgents.set(agent.id, agent);
        return agent;
    }
    release(agentId) {
        const agent = this.busyAgents.get(agentId);
        if (!agent)
            return;
        this.busyAgents.delete(agentId);
        if (this.config.reuseIdleAgents) {
            if (!this.idleAgents.has(agent.role)) {
                this.idleAgents.set(agent.role, []);
            }
            this.idleAgents.get(agent.role).push(agent);
        }
    }
    prewarm(role, count) {
        for (let i = 0; i < count; i++) {
            if (this.getTotalAgentsCount() >= this.config.maxAgents)
                break;
            const agent = this.factory.createAgent(role);
            if (!this.idleAgents.has(role))
                this.idleAgents.set(role, []);
            this.idleAgents.get(role).push(agent);
        }
    }
    getTotalAgentsCount() {
        let idleCount = 0;
        for (const list of this.idleAgents.values()) {
            idleCount += list.length;
        }
        return this.busyAgents.size + idleCount;
    }
}
//# sourceMappingURL=agent-pool.js.map