import { AnthropicProvider } from './providers/anthropic/index.js';
import { GoogleProvider } from './providers/google/index.js';
export class ProviderFactory {
    credentialResolver;
    constructor(credentialResolver) {
        this.credentialResolver = credentialResolver;
    }
    createProvider(config) {
        switch (config.providerId) {
            case 'anthropic':
                return new AnthropicProvider({
                    ...config,
                    credentialResolver: this.credentialResolver,
                });
            case 'google':
                return new GoogleProvider({
                    ...config,
                    credentialResolver: this.credentialResolver,
                });
            default:
                throw new Error(`Unsupported provider: ${config.providerId}`);
        }
    }
}
export class HealthCheckService {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    async checkAll() {
        const results = {};
        for (const provider of this.registry.list()) {
            results[provider.id] = await provider.checkHealth();
        }
        return results;
    }
}
export class CapabilityDiscovery {
    static supports(provider, capability) {
        return provider.capabilities[capability];
    }
}
export class ProviderRegistryCache {
    cache = new Map();
    ttlMs = 60 * 1000; // 1 minute status cache
    get(providerId) {
        const entry = this.cache.get(providerId);
        if (entry && Date.now() - entry.cachedAt < this.ttlMs) {
            return entry.status;
        }
        return undefined;
    }
    set(providerId, status) {
        this.cache.set(providerId, { status, cachedAt: Date.now() });
    }
    invalidate(providerId) {
        this.cache.delete(providerId);
    }
    clear() {
        this.cache.clear();
    }
}
//# sourceMappingURL=factory.js.map