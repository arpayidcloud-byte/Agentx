import type { SecretStore, SecretEntry, SecretMetadata } from './interfaces.js';
export declare class EnvVarSecretStore implements SecretStore {
    readonly backendId = "env";
    private env;
    constructor(env?: Record<string, string | undefined>);
    get(key: string): Promise<SecretEntry>;
    set(_key: string, _value: string, _metadata?: SecretMetadata): Promise<void>;
    delete(_key: string): Promise<void>;
    list(): Promise<string[]>;
    has(key: string): Promise<boolean>;
    rotate(_key: string): Promise<void>;
}
//# sourceMappingURL=env-backend.d.ts.map