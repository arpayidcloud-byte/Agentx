import { LRUCache } from 'lru-cache';
export class SecretCache {
    cache;
    negativeCache;
    config;
    constructor(config = {}) {
        this.config = {
            ttlMs: config.ttlMs ?? 5 * 60 * 1000, // 5 minutes
            maxSize: config.maxSize ?? 100,
            negativeTtlMs: config.negativeTtlMs ?? 5000, // 5 seconds
        };
        this.cache = new LRUCache({
            max: this.config.maxSize,
            ttl: this.config.ttlMs,
        });
        this.negativeCache = new LRUCache({
            max: this.config.maxSize,
            ttl: this.config.negativeTtlMs,
        });
    }
    get(key) {
        const cached = this.cache.get(key);
        if (cached) {
            return cached.value ?? undefined;
        }
        return undefined;
    }
    set(key, value) {
        this.negativeCache.delete(key);
        this.cache.set(key, { value, updatedAt: Date.now() });
    }
    delete(key) {
        this.cache.delete(key);
        this.negativeCache.delete(key);
    }
    has(key) {
        return this.cache.has(key) || this.negativeCache.has(key);
    }
    hasPositive(key) {
        return this.cache.has(key);
    }
    hasNegative(key) {
        return this.negativeCache.has(key);
    }
    setNegative(key) {
        this.cache.delete(key);
        this.negativeCache.set(key, { value: null, updatedAt: Date.now() });
    }
    clear() {
        this.cache.clear();
        this.negativeCache.clear();
    }
}
//# sourceMappingURL=cache.js.map