/**
 * @module runtime-adapters/provider-health
 * @description Provider health monitoring abstraction.
 */
export class ProviderHealthMonitor {
    history = new Map();
    async health(provider) {
        const health = await provider.healthCheck();
        const history = this.history.get(provider.getMetadata().id) || [];
        history.push(health);
        if (history.length > 100)
            history.shift();
        this.history.set(provider.getMetadata().id, history);
        return health;
    }
    async ping(provider) {
        const start = Date.now();
        await provider.healthCheck();
        return Date.now() - start;
    }
    latency(providerId) {
        const history = this.history.get(providerId) || [];
        if (history.length === 0)
            return 0;
        return history.reduce((sum, h) => sum + h.latencyMs, 0) / history.length;
    }
    availability(providerId) {
        const history = this.history.get(providerId) || [];
        if (history.length === 0)
            return 100;
        const healthy = history.filter(h => h.healthy).length;
        return (healthy / history.length) * 100;
    }
    failureCount(providerId) {
        const history = this.history.get(providerId) || [];
        return history.filter(h => !h.healthy).length;
    }
    lastFailure(providerId) {
        const history = this.history.get(providerId) || [];
        const failed = history.filter(h => !h.healthy);
        const last = failed[failed.length - 1];
        return last ? last.lastChecked : undefined;
    }
    getHistory(providerId) {
        return [...(this.history.get(providerId) || [])];
    }
}
//# sourceMappingURL=provider-health.js.map