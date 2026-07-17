/**
 * @module provider-sdk/credential-resolver
 * @description Local stub for credential resolver to avoid circular dependencies.
 */

export class CredentialResolver {
  async resolve(key: string): Promise<string> {
    return `stub-${key}`;
  }
}
