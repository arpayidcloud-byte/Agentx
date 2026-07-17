/**
 * @module runtime/runtime-supervisor-v2
 * @description Enhanced runtime supervisor with monitoring and recovery.
 */
import { RuntimeRecovery } from './runtime-recovery.js';
import { RuntimeHealthService } from './runtime-health-v2.js';
export class RuntimeSupervisorV2 {
    recovery;
    healthService;
    isRunning = false;
    constructor() {
        this.recovery = new RuntimeRecovery();
        this.healthService = new RuntimeHealthService();
        this.registerDefaultHealthChecks();
    }
    registerDefaultHealthChecks() {
        this.healthService.registerCheck('runtime', async () => ({
            component: 'runtime',
            healthy: this.isRunning,
            latencyMs: 0,
            lastChecked: new Date(),
        }));
    }
    async start() {
        this.isRunning = true;
    }
    async stop() {
        this.isRunning = false;
    }
    isHealthy() {
        return this.isRunning;
    }
    async getHealthReport() {
        return this.healthService.checkAll();
    }
    async handleAgentCrash(agentId) {
        return this.recovery.handleAgentCrash(agentId);
    }
    async handleToolTimeout(toolId) {
        return this.recovery.handleToolTimeout(toolId);
    }
    async handleHeartbeatLoss(agentId) {
        return this.recovery.handleHeartbeatLoss(agentId);
    }
    async handleApprovalTimeout(requestId) {
        return this.recovery.handleApprovalTimeout(requestId);
    }
    async handleCheckpointRecovery(workflowId) {
        return this.recovery.handleCheckpointRecovery(workflowId);
    }
    pause() {
        this.isRunning = false;
    }
    resume() {
        this.isRunning = true;
    }
    getRecoveryHistory() {
        return this.recovery.getRecoveryHistory();
    }
}
//# sourceMappingURL=runtime-supervisor-v2.js.map