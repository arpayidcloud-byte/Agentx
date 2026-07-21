export class SecretError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SecretError';
    }
}
export class SecretNotFoundError extends SecretError {
    constructor(key) {
        super(`Secret not found: ${key}`);
        this.name = 'SecretNotFoundError';
    }
}
export class OperationNotSupportedError extends SecretError {
    constructor(operation) {
        super(operation ? `Operation not supported: ${operation}` : 'Operation not supported');
        this.name = 'OperationNotSupportedError';
    }
}
export class SecretAccessError extends SecretError {
    constructor(message = 'Access denied') {
        super(message);
        this.name = 'SecretAccessError';
    }
}
export class CredentialResolutionError extends SecretError {
    constructor(logicalKey) {
        const envVarName = `AGENTX_SECRET_${logicalKey.toUpperCase().replace(/\./g, '_')}_API_KEY`;
        super(`Failed to resolve credential "${logicalKey}": environment variable ${envVarName} not found`);
        this.name = 'CredentialResolutionError';
    }
}
//# sourceMappingURL=errors.js.map