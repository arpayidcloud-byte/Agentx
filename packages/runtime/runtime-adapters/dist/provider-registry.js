/**
 * @module runtime-adapters/provider-registry
 * @description Centralized dependency injection registry for providers.
 */
import { ProviderUnavailableError, ProviderResolutionError } from './index.js';
import { ProviderCapabilityResolver } from './provider-capability.js';
export class ProviderRegistry {
    providers = new Map();
    capabilityResolver = new ProviderCapabilityResolver();
    registerProvider(id, provider) {
        this.providers.set(id, provider);
    }
    unregisterProvider(id) {
        this.providers.delete(id);
    }
    resolve(id) {
        const provider = this.providers.get(id);
        if (!provider) {
            throw new ProviderResolutionError(`Provider not found: ${id}`, 'registry');
        }
        return provider;
    }
    resolveByType(type) {
        const providers = Array.from(this.providers.values()).filter((p) => p.getMetadata().type === type);
        if (providers.length === 0) {
            throw new ProviderResolutionError(`No provider found for type: ${type}`, 'registry');
        }
        return providers[0];
    }
    resolveByCapability(requiredCapabilities) {
        return Array.from(this.providers.values()).filter((provider) => {
            try {
                this.capabilityResolver.validateCapabilities(requiredCapabilities, provider.getCapabilities());
                return true;
            }
            catch {
                return false;
            }
        });
    }
    listProviders() {
        return Array.from(this.providers.values()).map((p) => p.getMetadata());
    }
    async healthCheck() {
        for (const provider of this.providers.values()) {
            const health = await provider.healthCheck();
            if (!health.healthy) {
                throw new ProviderUnavailableError(`Provider ${provider.getMetadata().id} is unhealthy`, 'registry');
            }
        }
        return true;
    }
}
//# sourceMappingURL=provider-registry.js.map