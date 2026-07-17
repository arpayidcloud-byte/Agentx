/**
 * @module coordinator/coordinator-bootstrap
 * @description Bootstrap configuration for the Execution Coordinator.
 */
import { ProductionExecutionCoordinator } from './coordinator.js';
export class CoordinatorBootstrap {
    async bootstrap(options) {
        const config = {
            maxParallelExecutions: 10,
            maxQueueSize: 100,
            defaultTimeoutMs: 60000,
            retryBudget: 3,
            tokenBudget: 100000,
            costBudget: 50.0,
            ...options.config,
        };
        const coordinator = new ProductionExecutionCoordinator(options.eventBus, config);
        return coordinator;
    }
}
//# sourceMappingURL=coordinator-bootstrap.js.map