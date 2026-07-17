/**
 * @module provider-sdk/provider-validator
 * @description Master validator for checking pre-PQF compliance.
 */

import { IProvider } from '@agentx/runtime-adapters';
import { SchemaValidator } from './schema-validator.js';
import { ProviderManifest } from './interfaces.js';

export class ProviderValidator {
  private schema = new SchemaValidator();

  validate(provider: IProvider, manifest: ProviderManifest): boolean {
    this.schema.validateManifest(manifest);
    const meta = provider.getMetadata();
    return meta.id === manifest.id;
  }
}
