export interface CacheConfig {
    ttlMs: number;
    maxSize: number;
    negativeTtlMs: number;
}
export declare class SecretCache {
    private cache;
    private negativeCache;
    private config;
    constructor(config?: Partial<CacheConfig>);
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    has(key: string): boolean;
    hasPositive(key: string): boolean;
    hasNegative(key: string): boolean;
    setNegative(key: string): void;
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map