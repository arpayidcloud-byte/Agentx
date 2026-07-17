/**
 * @module runtime-adapters/memory/memory-worker-discovery
 * @description Reference in-memory service discovery provider.
 */
export class MemoryWorkerDiscoveryProvider {
    workers = new Map();
    total = 0;
    getMetadata() {
        return {
            id: 'memory-worker-discovery',
            name: 'Memory Worker Discovery Provider',
            type: 'worker-discovery',
            version: '0.1.0',
        };
    }
    getCapabilities() {
        return { leaderElection: true };
    }
    async healthCheck() {
        return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
    }
    getMetrics() {
        return { totalRequests: this.total, successfulRequests: this.total, failedRequests: 0, averageLatencyMs: 0 };
    }
    async registerWorker(workerId, metadata) {
        this.total++;
        const caps = metadata.capabilities || [];
        this.workers.set(workerId, { metadata, capabilities: caps });
    }
    async heartbeat(_workerId) {
        // Memory store assumes alive if present
    }
    async listWorkers() {
        return Array.from(this.workers.entries()).map(([id, w]) => ({ id, metadata: w.metadata }));
    }
    async removeWorker(workerId) {
        this.workers.delete(workerId);
    }
    async discover(capability) {
        return Array.from(this.workers.entries())
            .filter(([_, w]) => w.capabilities.includes(capability))
            .map(([id]) => id);
    }
}
//# sourceMappingURL=memory-worker-discovery.js.map