/**
 * @module runtime-adapters/memory/memory-secret
 * @description Reference in-memory secret storage provider.
 */
export class MemorySecretProvider {
    secrets = new Map();
    total = 0;
    successes = 0;
    getMetadata() {
        return {
            id: 'memory-secret',
            name: 'Memory Secret Provider',
            type: 'secret',
            version: '0.1.0',
        };
    }
    getCapabilities() {
        return { secretRotation: true };
    }
    async healthCheck() {
        return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
    }
    getMetrics() {
        return { totalRequests: this.total, successfulRequests: this.successes, failedRequests: 0, averageLatencyMs: 0 };
    }
    async getSecret(key) {
        this.total++;
        this.successes++;
        return this.secrets.get(key);
    }
    async putSecret(key, value) {
        this.total++;
        this.secrets.set(key, value);
        this.successes++;
    }
    async deleteSecret(key) {
        this.secrets.delete(key);
    }
    async listSecrets() {
        return Array.from(this.secrets.keys());
    }
    async rotateSecret(key, newValue) {
        this.secrets.set(key, newValue);
    }
}
//# sourceMappingURL=memory-secret.js.map