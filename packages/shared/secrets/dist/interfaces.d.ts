export type SecretCategory = 'provider' | 'database' | 'encryption' | 'plugin' | 'auth';
export type Classification = 'low' | 'medium' | 'high' | 'critical';
export interface SecretMetadata {
    category: SecretCategory;
    classification: Classification;
    lastRotatedAt?: Date;
    rotatedBy?: string;
}
export interface SecretEntry {
    key: string;
    value: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    metadata?: SecretMetadata;
}
export interface SecretStore {
    readonly backendId: string;
    get(key: string): Promise<SecretEntry>;
    set(key: string, value: string, metadata?: SecretMetadata): Promise<void>;
    delete(key: string): Promise<void>;
    list(): Promise<string[]>;
    has(key: string): Promise<boolean>;
    rotate?(key: string): Promise<void>;
}
export interface CredentialResolver {
    resolve(logicalKey: string): Promise<string>;
    resolveMetadata(logicalKey: string): Promise<SecretMetadata>;
    invalidate(logicalKey: string): Promise<void>;
    invalidateAll(): Promise<void>;
}
export interface CredentialResolverConfig {
    keyMapping: Record<string, string>;
    cacheTtlSeconds: number;
    enforceNoLog: boolean;
}
//# sourceMappingURL=interfaces.d.ts.map