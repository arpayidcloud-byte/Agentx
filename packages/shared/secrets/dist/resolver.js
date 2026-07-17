import { SecretCache } from './cache.js';
import { RedactedString } from './scrubber.js';
import { SecretNotFoundError, CredentialResolutionError } from './errors.js';
export class CachedCredentialResolver {
    cache;
    backend;
    keyMapping;
    constructor(backend, options) {
        this.backend = backend;
        this.keyMapping = options?.keyMapping || {};
        this.cache = new SecretCache({
            ttlMs: options?.ttlMs,
            negativeTtlMs: options?.negativeTtlMs,
        });
    }
    async resolve(logicalKey) {
        const backendKey = this.resolveBackendKey(logicalKey);
        // Check negative cache first
        if (this.cache.hasNegative(backendKey)) {
            this.throwResolutionError(logicalKey);
        }
        // Check positive cache
        const cached = this.cache.get(backendKey);
        if (cached !== undefined) {
            return cached;
        }
        try {
            const entry = await this.backend.get(backendKey);
            this.cache.set(backendKey, entry.value);
            return entry.value;
        }
        catch (e) {
            if (e instanceof SecretNotFoundError) {
                this.cache.setNegative(backendKey);
                this.throwResolutionError(logicalKey);
            }
            throw e;
        }
    }
    async resolveRedacted(logicalKey) {
        const value = await this.resolve(logicalKey);
        return new RedactedString(value);
    }
    async resolveMetadata(logicalKey) {
        const backendKey = this.resolveBackendKey(logicalKey);
        const entry = await this.backend.get(backendKey);
        if (entry.metadata) {
            return entry.metadata;
        }
        return {
            category: 'provider',
            classification: 'high',
        };
    }
    async invalidate(logicalKey) {
        const backendKey = this.resolveBackendKey(logicalKey);
        this.cache.delete(backendKey);
    }
    async invalidateAll() {
        this.cache.clear();
    }
    resolveBackendKey(logicalKey) {
        return this.keyMapping[logicalKey] || logicalKey;
    }
    throwResolutionError(logicalKey) {
        // Attempt to extract providerId if logicalKey format matches 'provider.{id}.api_key'
        let providerId = logicalKey;
        const match = logicalKey.match(/^provider\.(.+?)\.api_key$/);
        if (match && match[1]) {
            providerId = match[1];
        }
        throw new CredentialResolutionError(providerId);
    }
}
//# sourceMappingURL=resolver.js.map