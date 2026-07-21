import { auditTrail } from './audit-trail.js';
import { SecretNotFoundError, CredentialResolutionError, SecretError } from './errors.js';
import { RedactedString } from './scrubber.js';
import { LRUCache } from 'lru-cache';
export class CachedCredentialResolver {
    store;
    config;
    cache;
    negativeCache;
    constructor(store, config = { keyMapping: {}, cacheTtlSeconds: 300, enforceNoLog: true }) {
        this.store = store;
        this.config = config;
        this.cache = new LRUCache({
            max: 100,
            ttl: config.cacheTtlSeconds * 1000,
        });
        this.negativeCache = new Map();
    }
    async resolve(logicalKey) {
        auditTrail(logicalKey, 'resolve');
        const backendKey = this.config.keyMapping[logicalKey] || logicalKey;
        if (this.negativeCache.has(backendKey)) {
            throw new CredentialResolutionError(logicalKey);
        }
        const cached = this.cache.get(backendKey);
        if (cached !== undefined) {
            return cached;
        }
        try {
            const entry = await this.store.get(backendKey);
            this.cache.set(backendKey, entry.value);
            return entry.value;
        }
        catch (err) {
            if (err instanceof SecretNotFoundError) {
                this.negativeCache.set(backendKey, Date.now() + 60000);
                throw new CredentialResolutionError(logicalKey);
            }
            throw new SecretError(`Failed to resolve secret "${logicalKey}": ${err.message}`);
        }
    }
    async resolveRedacted(logicalKey) {
        const value = await this.resolve(logicalKey);
        return new RedactedString(value);
    }
    async resolveMetadata(logicalKey) {
        auditTrail(logicalKey, 'resolve_metadata');
        const backendKey = this.config.keyMapping[logicalKey] || logicalKey;
        try {
            const entry = await this.store.get(backendKey);
            return (entry.metadata || {
                category: 'provider',
                classification: 'high',
            });
        }
        catch {
            return undefined;
        }
    }
    async invalidate(logicalKey) {
        const backendKey = this.config.keyMapping[logicalKey] || logicalKey;
        this.cache.delete(backendKey);
        this.negativeCache.delete(backendKey);
        auditTrail(backendKey, 'invalidate');
    }
    async invalidateAll() {
        this.cache.clear();
        this.negativeCache.clear();
        auditTrail('*', 'invalidate_all');
    }
}
//# sourceMappingURL=resolver.js.map