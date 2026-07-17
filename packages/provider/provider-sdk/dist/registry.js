import { CircuitBreakerOpenError, ProviderError, ProviderTimeoutError, ProviderRateLimitError } from './errors.js';
export class ProviderRegistry {
    providers = new Map();
    failoverPolicies = [];
    register(provider) {
        this.providers.set(provider.id, provider);
    }
    registerFailoverPolicy(policy) {
        this.failoverPolicies.push(policy);
    }
    get(providerId) {
        return this.providers.get(providerId);
    }
    list() {
        return Array.from(this.providers.values());
    }
    async complete(providerId, req) {
        const provider = this.get(providerId);
        if (!provider) {
            throw new Error(`Provider not found: ${providerId}`);
        }
        try {
            return await provider.complete(req);
        }
        catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            // Check failover
            const policy = this.failoverPolicies.find((p) => p.primaryProviderId === providerId);
            if (policy) {
                let shouldFailover = false;
                if (policy.onCondition === 'timeout' && error instanceof ProviderTimeoutError)
                    shouldFailover = true;
                if (policy.onCondition === 'rate_limit' && error instanceof ProviderRateLimitError)
                    shouldFailover = true;
                if (policy.onCondition === 'error' && error instanceof ProviderError)
                    shouldFailover = true;
                if (error instanceof CircuitBreakerOpenError)
                    shouldFailover = true;
                if (shouldFailover) {
                    const secondary = this.get(policy.secondaryProviderId);
                    if (secondary) {
                        return await secondary.complete(req);
                    }
                }
            }
            throw error;
        }
    }
}
//# sourceMappingURL=registry.js.map