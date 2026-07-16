/**
 * @module runtime-adapters/memory/memory-secret
 * @description Reference in-memory secret storage provider.
 */
import { ISecretProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class MemorySecretProvider implements ISecretProvider {
    private secrets;
    private total;
    private successes;
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    getSecret(key: string): Promise<string | undefined>;
    putSecret(key: string, value: string): Promise<void>;
    deleteSecret(key: string): Promise<void>;
    listSecrets(): Promise<string[]>;
    rotateSecret(key: string, newValue: string): Promise<void>;
}
//# sourceMappingURL=memory-secret.d.ts.map