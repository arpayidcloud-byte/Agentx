import type { CredentialResolver, CredentialResolverConfig, SecretMetadata } from './interfaces.js';
import type { SecretStore } from './interfaces.js';
import { RedactedString } from './scrubber.js';
export declare class CachedCredentialResolver implements CredentialResolver {
    private readonly store;
    private readonly config;
    private readonly cache;
    private readonly negativeCache;
    constructor(store: SecretStore, config?: CredentialResolverConfig);
    resolve(logicalKey: string): Promise<string>;
    resolveRedacted(logicalKey: string): Promise<RedactedString>;
    resolveMetadata(logicalKey: string): Promise<SecretMetadata | undefined>;
    invalidate(logicalKey: string): Promise<void>;
    invalidateAll(): Promise<void>;
}
//# sourceMappingURL=resolver.d.ts.map