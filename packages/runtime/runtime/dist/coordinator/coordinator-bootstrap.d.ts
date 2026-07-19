/**
 * @module coordinator/coordinator-bootstrap
 * @description Bootstrap configuration for the Execution Coordinator.
 */
import type { CoordinatorConfig } from './interfaces.js';
import { ProductionExecutionCoordinator } from './coordinator.js';
import type { IEventBus } from '@agentx/core-runtime';
export interface CoordinatorBootstrapOptions {
    config?: Partial<CoordinatorConfig>;
    eventBus: IEventBus;
}
export declare class CoordinatorBootstrap {
    bootstrap(options: CoordinatorBootstrapOptions): Promise<ProductionExecutionCoordinator>;
}
//# sourceMappingURL=coordinator-bootstrap.d.ts.map