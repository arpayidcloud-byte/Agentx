import { LRUCache } from 'lru-cache';
export class SecretCache {
    positiveCache;
    negativeCache;
    constructor(config = {}) {
        this.positiveCache = new LRUCache({
            max: config.maxSize || 100,
            ttl: config.ttlMs || 1000 * 60 * 5,
            ttlAutopurge: true,
        });
        this.negativeCache = new LRUCache({
            ttl: config.negativeTtlMs || 1000 * 60 * 5,
            ttlAutopurge: true,
        });
    }
    set(key, value) {
        this.negativeCache.delete(key);
        this.positiveCache.set(key, value);
    }
    setNegative(key) {
        this.positiveCache.delete(key);
        this.negativeCache.set(key, true);
    }
    get(key) {
        return this.positiveCache.get(key);
    }
    has(key) {
        return this.positiveCache.has(key) || this.negativeCache.has(key);
    }
    hasPositive(key) {
        return this.positiveCache.has(key);
    }
    hasNegative(key) {
        return this.negativeCache.has(key);
    }
    delete(key) {
        this.positiveCache.delete(key);
        this.negativeCache.delete(key);
    }
    clear() {
        this.positiveCache.clear();
        this.negativeCache.clear();
    }
}
const globalCache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 5,
    ttlAutopurge: true,
});
export const getCache = (key) => globalCache.get(key);
export const setCache = (key, value) => globalCache.set(key, value);
export const deleteCache = (key) => globalCache.delete(key);
export const clearCache = () => globalCache.clear();
//# sourceMappingURL=cache.js.map