export class SecretError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Ensure the prototype chain is properly restored
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class OperationNotSupportedError extends SecretError {
  constructor(message: string = 'Operation not supported by the current secret store backend.') {
    super(message);
  }
}

export class SecretAccessError extends SecretError {
  constructor(message: string = 'Access to the requested secret was denied.') {
    super(message);
  }
}

export class SecretNotFoundError extends SecretError {
  constructor(key: string) {
    super(`Secret not found for key: ${key}`);
  }
}

export class CredentialResolutionError extends SecretError {
  constructor(providerId: string) {
    super(`Credential not found: provider.${providerId}.api_key. Set it via 'agentx secrets set' or the AGENTX_SECRET_${providerId.toUpperCase()}_API_KEY env var.`);
  }
}
