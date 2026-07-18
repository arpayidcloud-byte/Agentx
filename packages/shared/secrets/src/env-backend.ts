import { SecretStore, SecretEntry, SecretMetadata } from './interfaces.js';
import { OperationNotSupportedError, SecretNotFoundError } from './errors.js';

export class EnvVarSecretStore implements SecretStore {
  readonly backendId = 'env';

  constructor(private readonly env: Record<string, string | undefined> = process.env) {}

  public async get(key: string): Promise<SecretEntry> {
    const value = this.env[key];
    if (value === undefined) {
      throw new SecretNotFoundError(key);
    }
    return {
      key,
      value,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        category: 'provider',
        classification: 'high',
      },
    };
  }

  public async set(_key: string, _value: string, _metadata?: SecretMetadata): Promise<void> {
    throw new OperationNotSupportedError(
      'set() is not supported by EnvVarSecretStore (immutable at runtime)',
    );
  }

  public async delete(_key: string): Promise<void> {
    throw new OperationNotSupportedError(
      'delete() is not supported by EnvVarSecretStore (immutable at runtime)',
    );
  }

  public async list(): Promise<string[]> {
    return Object.keys(this.env).filter((key) => key.startsWith('AGENTX_SECRET_'));
  }

  public async has(key: string): Promise<boolean> {
    return this.env[key] !== undefined;
  }

  public async rotate(_key: string): Promise<void> {
    throw new OperationNotSupportedError(
      'rotate() is not supported by EnvVarSecretStore (immutable at runtime)',
    );
  }
}
