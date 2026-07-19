/**
 * @module coordinator/concurrency
 * @description Concurrency control for parallel execution limits.
 */
export class ConcurrencyController {
    active = new Map();
    config;
    constructor(config) {
        this.config = config;
    }
    canAcquire(type) {
        const limit = this.getLimit(type);
        const current = this.active.get(type) || 0;
        return current < limit;
    }
    acquire(type) {
        if (!this.canAcquire(type)) {
            return false;
        }
        const current = this.active.get(type) || 0;
        this.active.set(type, current + 1);
        return true;
    }
    release(type) {
        const current = this.active.get(type) || 0;
        this.active.set(type, Math.max(0, current - 1));
    }
    getUsage(type) {
        return this.active.get(type) || 0;
    }
    getLimit(type) {
        switch (type) {
            case 'worker':
                return this.config.maxWorkers;
            case 'tool':
                return this.config.maxTools;
            case 'provider':
                return this.config.maxProviders;
            case 'approval':
                return this.config.maxApprovals;
            case 'agent':
                return this.config.maxAgents;
            case 'queue':
                return this.config.maxQueueSize;
            case 'parallel':
                return this.config.maxParallel;
            case 'batch':
                return this.config.maxBatch;
            default:
                return Infinity;
        }
    }
    reset() {
        this.active.clear();
    }
}
//# sourceMappingURL=concurrency.js.map