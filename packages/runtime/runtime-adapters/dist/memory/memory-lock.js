/**
 * @module runtime-adapters/memory/memory-lock
 * @description Reference in-memory distributed lock provider.
 */
export class MemoryLockProvider {
    locks = new Map();
    total = 0;
    successes = 0;
    getMetadata() {
        return {
            id: 'memory-lock',
            name: 'Memory Lock Provider',
            type: 'lock',
            version: '0.1.0',
        };
    }
    getCapabilities() {
        return { distributedLocks: true };
    }
    async healthCheck() {
        return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
    }
    getMetrics() {
        return {
            totalRequests: this.total,
            successfulRequests: this.successes,
            failedRequests: 0,
            averageLatencyMs: 0,
        };
    }
    async acquire(key, ttlMs) {
        this.total++;
        const existing = this.locks.get(key);
        if (existing && existing.expiresAt > Date.now()) {
            throw new Error(`Lock already held: ${key}`);
        }
        const id = `lock-${Date.now()}-${Math.random()}`;
        this.locks.set(key, { id, expiresAt: Date.now() + ttlMs });
        this.successes++;
        return id;
    }
    async release(key, lockId) {
        const existing = this.locks.get(key);
        if (existing && existing.id === lockId) {
            this.locks.delete(key);
        }
    }
    async renew(key, lockId, ttlMs) {
        const existing = this.locks.get(key);
        if (existing && existing.id === lockId) {
            existing.expiresAt = Date.now() + ttlMs;
        }
    }
    async expire(key) {
        this.locks.delete(key);
    }
    async isLocked(key) {
        const existing = this.locks.get(key);
        return !!existing && existing.expiresAt > Date.now();
    }
}
//# sourceMappingURL=memory-lock.js.map