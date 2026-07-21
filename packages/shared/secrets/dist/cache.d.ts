import { LRUCache } from 'lru-cache';
interface SecretCacheConfig {
    ttlMs?: number;
    maxSize?: number;
    negativeTtlMs?: number;
}
export declare class SecretCache {
    private positiveCache;
    private negativeCache;
    constructor(config?: SecretCacheConfig);
    set(key: string, value: string): void;
    setNegative(key: string): void;
    get(key: string): string | undefined;
    has(key: string): boolean;
    hasPositive(key: string): boolean;
    hasNegative(key: string): boolean;
    delete(key: string): void;
    clear(): void;
}
export declare const getCache: (key: string) => string | undefined;
export declare const setCache: (key: string, value: string) => LRUCache<string, string, unknown>;
export declare const deleteCache: (key: string) => boolean;
export declare const clearCache: () => void;
export {};
//# sourceMappingURL=cache.d.ts.map