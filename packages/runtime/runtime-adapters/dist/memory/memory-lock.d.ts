/**
 * @module runtime-adapters/memory/memory-lock
 * @description Reference in-memory distributed lock provider.
 */
import { ILockProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class MemoryLockProvider implements ILockProvider {
    private locks;
    private total;
    private successes;
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    acquire(key: string, ttlMs: number): Promise<string>;
    release(key: string, lockId: string): Promise<void>;
    renew(key: string, lockId: string, ttlMs: number): Promise<void>;
    expire(key: string): Promise<void>;
    isLocked(key: string): Promise<boolean>;
}
//# sourceMappingURL=memory-lock.d.ts.map