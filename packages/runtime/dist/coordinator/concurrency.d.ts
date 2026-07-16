/**
 * @module coordinator/concurrency
 * @description Concurrency control for parallel execution limits.
 */
export interface ConcurrencyConfig {
    maxWorkers: number;
    maxTools: number;
    maxProviders: number;
    maxApprovals: number;
    maxAgents: number;
    maxQueueSize: number;
    maxParallel: number;
    maxBatch: number;
}
export declare class ConcurrencyController {
    private active;
    private config;
    constructor(config: ConcurrencyConfig);
    canAcquire(type: string): boolean;
    acquire(type: string): boolean;
    release(type: string): void;
    getUsage(type: string): number;
    private getLimit;
    reset(): void;
}
//# sourceMappingURL=concurrency.d.ts.map