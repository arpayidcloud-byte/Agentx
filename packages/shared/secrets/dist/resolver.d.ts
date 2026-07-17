import { CredentialResolver, SecretStore, SecretMetadata } from './interfaces.js';
import { RedactedString } from './scrubber.js';
export declare class CachedCredentialResolver implements CredentialResolver {
    private cache;
    private backend;
    private keyMapping;
    constructor(backend: SecretStore, options?: {
        keyMapping?: Record<string, string>;
        ttlMs?: number;
        negativeTtlMs?: number;
    });
    resolve(logicalKey: string): Promise<string>;
    resolveRedacted(logicalKey: string): Promise<RedactedString>;
    resolveMetadata(logicalKey: string): Promise<SecretMetadata>;
    invalidate(logicalKey: string): Promise<void>;
    invalidateAll(): Promise<void>;
    private resolveBackendKey;
    private throwResolutionError;
}
//# sourceMappingURL=resolver.d.ts.map