export class ParallelRunner {
    pool;
    bus;
    constructor(pool, bus) {
        this.pool = pool;
        this.bus = bus;
    }
    async runParallel(task, roles, context) {
        const promises = [];
        const results = {};
        const errors = {};
        for (const role of roles) {
            promises.push(this.runSingleAgent(role, task, context, results, errors));
        }
        await Promise.all(promises);
        return {
            taskId: task.id,
            results,
            errors,
        };
    }
    async runSingleAgent(role, task, context, results, errors) {
        const agent = this.pool.acquire(role);
        try {
            this.bus.publish({
                id: `msg-${Date.now()}-${agent.id}`,
                topic: 'TaskAssigned',
                senderId: 'orchestrator',
                receiverId: agent.id,
                taskId: task.id,
                payload: { role },
                timestamp: new Date(),
            });
            const result = await agent.execute(task, context);
            results[agent.id] = result;
            this.bus.publish({
                id: `msg-${Date.now()}-${agent.id}-done`,
                topic: 'TaskCompleted',
                senderId: agent.id,
                taskId: task.id,
                payload: { result },
                timestamp: new Date(),
            });
        }
        catch (e) {
            errors[agent.id] = e instanceof Error ? e : new Error(String(e));
            this.bus.publish({
                id: `msg-${Date.now()}-${agent.id}-err`,
                topic: 'TaskFailed',
                senderId: agent.id,
                taskId: task.id,
                payload: { error: String(e) },
                timestamp: new Date(),
            });
        }
        finally {
            this.pool.release(agent.id);
        }
    }
}
//# sourceMappingURL=parallel-runner.js.map