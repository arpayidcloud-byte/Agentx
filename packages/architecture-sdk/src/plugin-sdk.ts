/**
 * @module architecture-sdk/plugin-sdk
 * @description SDK contract definition for third-party plugins.
 */

import { PluginManifest } from './interfaces.js';

export class PluginSDK {
  validate(manifest: PluginManifest): boolean {
    return manifest.id !== '' && manifest.version !== '';
  }
}
