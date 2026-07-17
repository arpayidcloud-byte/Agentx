/**
 * @module runtime/runtime-recovery
 * @description Recovery integration for automatic fault handling.
 */
export interface RecoveryAction {
    type: 'restart_agent' | 'retry_workflow' | 'restore_checkpoint' | 'pause_runtime';
    targetId: string;
    reason: string;
    timestamp: Date;
}
export interface RecoveryPolicy {
    maxRetries: number;
    retryDelayMs: number;
    enableCheckpointRecovery: boolean;
    enableAgentRestart: boolean;
}
export declare class RuntimeRecovery {
    private policy;
    private recoveryHistory;
    constructor(policy?: Partial<RecoveryPolicy>);
    handleAgentCrash(agentId: string): Promise<RecoveryAction>;
    handleToolTimeout(toolId: string): Promise<RecoveryAction>;
    handleWorkflowRetry(workflowId: string): Promise<RecoveryAction>;
    handleHeartbeatLoss(agentId: string): Promise<RecoveryAction>;
    handleApprovalTimeout(requestId: string): Promise<RecoveryAction>;
    handleCheckpointRecovery(workflowId: string): Promise<RecoveryAction>;
    getRecoveryHistory(): RecoveryAction[];
    getPolicy(): RecoveryPolicy;
}
//# sourceMappingURL=runtime-recovery.d.ts.map