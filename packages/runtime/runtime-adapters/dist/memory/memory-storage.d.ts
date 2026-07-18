/**
 * @module runtime-adapters/memory/memory-storage
 * @description Reference in-memory database and storage provider.
 */
import type { IStorageProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class MemoryStorageProvider implements IStorageProvider {
    private store;
    private total;
    private successes;
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    put(bucket: string, key: string, value: string): Promise<void>;
    get(bucket: string, key: string): Promise<string | undefined>;
    delete(bucket: string, key: string): Promise<void>;
    list(bucket: string, prefix?: string): Promise<string[]>;
    exists(bucket: string, key: string): Promise<boolean>;
    transaction(operations: () => Promise<void>): Promise<void>;
}
//# sourceMappingURL=memory-storage.d.ts.map