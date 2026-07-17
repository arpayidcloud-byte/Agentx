/**
 * @module runtime/runtime-recovery
 * @description Recovery integration for automatic fault handling.
 */
export class RuntimeRecovery {
    policy;
    recoveryHistory = [];
    constructor(policy = {}) {
        this.policy = {
            maxRetries: policy.maxRetries ?? 3,
            retryDelayMs: policy.retryDelayMs ?? 5000,
            enableCheckpointRecovery: policy.enableCheckpointRecovery ?? true,
            enableAgentRestart: policy.enableAgentRestart ?? true,
        };
    }
    async handleAgentCrash(agentId) {
        const action = {
            type: 'restart_agent',
            targetId: agentId,
            reason: 'Agent crash detected',
            timestamp: new Date(),
        };
        this.recoveryHistory.push(action);
        return action;
    }
    async handleToolTimeout(toolId) {
        const action = {
            type: 'retry_workflow',
            targetId: toolId,
            reason: 'Tool execution timeout',
            timestamp: new Date(),
        };
        this.recoveryHistory.push(action);
        return action;
    }
    async handleWorkflowRetry(workflowId) {
        const action = {
            type: 'retry_workflow',
            targetId: workflowId,
            reason: 'Workflow retry requested',
            timestamp: new Date(),
        };
        this.recoveryHistory.push(action);
        return action;
    }
    async handleHeartbeatLoss(agentId) {
        const action = {
            type: 'restart_agent',
            targetId: agentId,
            reason: 'Heartbeat loss detected',
            timestamp: new Date(),
        };
        this.recoveryHistory.push(action);
        return action;
    }
    async handleApprovalTimeout(requestId) {
        const action = {
            type: 'pause_runtime',
            targetId: requestId,
            reason: 'Approval request timed out',
            timestamp: new Date(),
        };
        this.recoveryHistory.push(action);
        return action;
    }
    async handleCheckpointRecovery(workflowId) {
        const action = {
            type: 'restore_checkpoint',
            targetId: workflowId,
            reason: 'Checkpoint recovery requested',
            timestamp: new Date(),
        };
        this.recoveryHistory.push(action);
        return action;
    }
    getRecoveryHistory() {
        return [...this.recoveryHistory];
    }
    getPolicy() {
        return { ...this.policy };
    }
}
//# sourceMappingURL=runtime-recovery.js.map