/**
 * @module runtime/runtime-supervisor-v2
 * @description Enhanced runtime supervisor with monitoring and recovery.
 */
import type { RecoveryAction } from './runtime-recovery.js';
import type { RuntimeHealthReport } from './runtime-health-v2.js';
export declare class RuntimeSupervisorV2 {
    private recovery;
    private healthService;
    private isRunning;
    constructor();
    private registerDefaultHealthChecks;
    start(): Promise<void>;
    stop(): Promise<void>;
    isHealthy(): boolean;
    getHealthReport(): Promise<RuntimeHealthReport>;
    handleAgentCrash(agentId: string): Promise<RecoveryAction>;
    handleToolTimeout(toolId: string): Promise<RecoveryAction>;
    handleHeartbeatLoss(agentId: string): Promise<RecoveryAction>;
    handleApprovalTimeout(requestId: string): Promise<RecoveryAction>;
    handleCheckpointRecovery(workflowId: string): Promise<RecoveryAction>;
    pause(): void;
    resume(): void;
    getRecoveryHistory(): RecoveryAction[];
}
//# sourceMappingURL=runtime-supervisor-v2.d.ts.map