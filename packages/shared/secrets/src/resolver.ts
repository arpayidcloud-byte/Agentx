import type { CredentialResolver, SecretStore, SecretMetadata } from './interfaces.js';
import { SecretCache } from './cache.js';
import { RedactedString } from './scrubber.js';
import { SecretNotFoundError, CredentialResolutionError } from './errors.js';

export class CachedCredentialResolver implements CredentialResolver {
  private cache: SecretCache;
  private backend: SecretStore;
  private keyMapping: Record<string, string>;

  constructor(
    backend: SecretStore,
    options?: { keyMapping?: Record<string, string>; ttlMs?: number; negativeTtlMs?: number },
  ) {
    this.backend = backend;
    this.keyMapping = options?.keyMapping || {};
    this.cache = new SecretCache({
      ttlMs: options?.ttlMs,
      negativeTtlMs: options?.negativeTtlMs,
    });
  }

  public async resolve(logicalKey: string): Promise<string> {
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
    } catch (e: unknown) {
      if (e instanceof SecretNotFoundError) {
        this.cache.setNegative(backendKey);
        this.throwResolutionError(logicalKey);
      }
      throw e;
    }
  }

  public async resolveRedacted(logicalKey: string): Promise<RedactedString> {
    const value = await this.resolve(logicalKey);
    return new RedactedString(value);
  }

  public async resolveMetadata(logicalKey: string): Promise<SecretMetadata> {
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

  public async invalidate(logicalKey: string): Promise<void> {
    const backendKey = this.resolveBackendKey(logicalKey);
    this.cache.delete(backendKey);
  }

  public async invalidateAll(): Promise<void> {
    this.cache.clear();
  }

  private resolveBackendKey(logicalKey: string): string {
    return this.keyMapping[logicalKey] || logicalKey;
  }

  private throwResolutionError(logicalKey: string): never {
    // Attempt to extract providerId if logicalKey format matches 'provider.{id}.api_key'
    let providerId = logicalKey;
    const match = logicalKey.match(/^provider\.(.+?)\.api_key$/);
    if (match && match[1]) {
      providerId = match[1];
    }
    throw new CredentialResolutionError(providerId);
  }
}
