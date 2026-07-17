/**
 * @module runtime-adapters/memory/memory-storage
 * @description Reference in-memory database and storage provider.
 */
export class MemoryStorageProvider {
    store = new Map();
    total = 0;
    successes = 0;
    getMetadata() {
        return {
            id: 'memory-storage',
            name: 'Memory Storage Provider',
            type: 'storage',
            version: '0.1.0',
        };
    }
    getCapabilities() {
        return { transactions: true };
    }
    async healthCheck() {
        return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
    }
    getMetrics() {
        return { totalRequests: this.total, successfulRequests: this.successes, failedRequests: 0, averageLatencyMs: 0 };
    }
    async put(bucket, key, value) {
        this.total++;
        const b = this.store.get(bucket) || new Map();
        b.set(key, value);
        this.store.set(bucket, b);
        this.successes++;
    }
    async get(bucket, key) {
        return this.store.get(bucket)?.get(key);
    }
    async delete(bucket, key) {
        this.store.get(bucket)?.delete(key);
    }
    async list(bucket, prefix) {
        const keys = Array.from(this.store.get(bucket)?.keys() || []);
        if (prefix) {
            return keys.filter(k => k.startsWith(prefix));
        }
        return keys;
    }
    async exists(bucket, key) {
        return this.store.get(bucket)?.has(key) || false;
    }
    async transaction(operations) {
        // Basic synchronous transaction execution
        await operations();
    }
}
//# sourceMappingURL=memory-storage.js.map