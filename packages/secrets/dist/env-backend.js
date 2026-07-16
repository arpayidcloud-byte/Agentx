import { OperationNotSupportedError, SecretNotFoundError, } from './errors.js';
export class EnvVarSecretStore {
    env;
    backendId = 'env';
    constructor(env = process.env) {
        this.env = env;
    }
    async get(key) {
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
    async set(_key, _value, _metadata) {
        throw new OperationNotSupportedError('set() is not supported by EnvVarSecretStore (immutable at runtime)');
    }
    async delete(_key) {
        throw new OperationNotSupportedError('delete() is not supported by EnvVarSecretStore (immutable at runtime)');
    }
    async list() {
        return Object.keys(this.env).filter((key) => key.startsWith('AGENTX_SECRET_'));
    }
    async has(key) {
        return this.env[key] !== undefined;
    }
    async rotate(_key) {
        throw new OperationNotSupportedError('rotate() is not supported by EnvVarSecretStore (immutable at runtime)');
    }
}
//# sourceMappingURL=env-backend.js.map