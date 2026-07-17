import { Provider, ProviderConfiguration, ProviderCapabilities, ProviderStatus } from './interfaces.js';
import { CredentialResolver } from '@agentx/secrets';
import { ProviderRegistry } from './registry.js';
export declare class ProviderFactory {
    private readonly credentialResolver;
    constructor(credentialResolver: CredentialResolver);
    createProvider(config: ProviderConfiguration): Provider;
}
export declare class HealthCheckService {
    private readonly registry;
    constructor(registry: ProviderRegistry);
    checkAll(): Promise<Record<string, ProviderStatus>>;
}
export declare class CapabilityDiscovery {
    static supports(provider: Provider, capability: keyof ProviderCapabilities): boolean;
}
export declare class ProviderRegistryCache {
    private cache;
    private ttlMs;
    get(providerId: string): ProviderStatus | undefined;
    set(providerId: string, status: ProviderStatus): void;
    invalidate(providerId: string): void;
    clear(): void;
}
//# sourceMappingURL=factory.d.ts.map