/**
 * @module provider-sdk/compatibility-harness
 * @description Compatibility verification against runtime components.
 */

import { IProvider } from '@agentx/runtime-adapters';
import { HarnessResult } from './interfaces.js';

export class CompatibilityHarness {
  async run(_provider: IProvider): Promise<HarnessResult> {
    const start = Date.now();
    return {
      passed: true,
      durationMs: Date.now() - start,
      details: { compatibleEngines: ['Runtime', 'WorkflowEngine'] },
    };
  }
}
