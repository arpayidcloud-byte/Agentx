import type { ILockProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class RedisLockProvider implements ILockProvider {
    private redis;
    private total;
    private successes;
    private failures;
    constructor(redisUrl?: string);
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
//# sourceMappingURL=redis-lock.d.ts.map