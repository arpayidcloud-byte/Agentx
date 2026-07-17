export class ExecutionContext {
    traceId;
    taskId;
    workflowId;
    agentId;
    providerId;
    logger;
    credentialResolver;
    task;
    scopedVars = new Map();
    constructor(config) {
        this.traceId = config.traceId;
        this.taskId = config.taskId;
        this.workflowId = config.workflowId;
        this.agentId = config.agentId;
        this.providerId = config.providerId;
        this.logger = config.logger.withContext({
            traceId: this.traceId,
            taskId: this.taskId,
            workflowId: this.workflowId,
            agentId: this.agentId,
            providerId: this.providerId,
        });
        this.credentialResolver = config.credentialResolver;
        this.task = config.task;
    }
    setScopedVar(key, value) {
        this.scopedVars.set(key, value);
    }
    getScopedVar(key) {
        return this.scopedVars.get(key);
    }
    cloneWithAgent(agentId) {
        return new ExecutionContext({
            traceId: this.traceId,
            taskId: this.taskId,
            workflowId: this.workflowId,
            agentId,
            providerId: this.providerId,
            logger: this.logger,
            credentialResolver: this.credentialResolver,
            task: this.task,
        });
    }
    cloneWithProvider(providerId) {
        return new ExecutionContext({
            traceId: this.traceId,
            taskId: this.taskId,
            workflowId: this.workflowId,
            agentId: this.agentId,
            providerId,
            logger: this.logger,
            credentialResolver: this.credentialResolver,
            task: this.task,
        });
    }
}
//# sourceMappingURL=index.js.map