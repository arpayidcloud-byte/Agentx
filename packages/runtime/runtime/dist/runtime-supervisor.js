/**
 * @module runtime/runtime-supervisor
 * @description Runtime supervisor for monitoring and recovery.
 */
import { HealthChecker, defaultHealthCheck } from './runtime-health.js';
export class RuntimeSupervisor {
    healthChecker;
    isRunning = false;
    constructor() {
        this.healthChecker = new HealthChecker();
        this.registerDefaultChecks();
    }
    registerDefaultChecks() {
        const components = [
            'planning',
            'workflow',
            'memory',
            'knowledge',
            'context',
            'approval',
            'toolSDK',
            'agentPool',
            'eventBus',
            'metrics',
        ];
        for (const component of components) {
            this.healthChecker.register(component, () => defaultHealthCheck(component));
        }
    }
    start() {
        this.isRunning = true;
    }
    stop() {
        this.isRunning = false;
    }
    isHealthy() {
        return this.isRunning && this.healthChecker.isHealthy();
    }
    getHealthStatus() {
        return this.healthChecker.checkAll();
    }
    pause() {
        this.isRunning = false;
    }
    resume() {
        this.isRunning = true;
    }
}
//# sourceMappingURL=runtime-supervisor.js.map