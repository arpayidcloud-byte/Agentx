/**
 * @module runtime-adapters/provider-registry
 * @description Centralized dependency injection registry for providers.
 */
import type { IProvider, ProviderMetadata, ProviderCapabilities } from './index.js';
export declare class ProviderRegistry {
    private providers;
    private capabilityResolver;
    registerProvider(id: string, provider: IProvider): void;
    unregisterProvider(id: string): void;
    resolve<T extends IProvider>(id: string): T;
    resolveByType<T extends IProvider>(type: string): T;
    resolveByCapability<T extends IProvider>(requiredCapabilities: Partial<ProviderCapabilities>): T[];
    listProviders(): ProviderMetadata[];
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=provider-registry.d.ts.map