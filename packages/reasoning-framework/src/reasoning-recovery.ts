/**
 * @module reasoning-framework/reasoning-recovery
 * @description Recovery manager operations.
 */

import { ReasoningSnapshot } from './interfaces.js';

export class ReasoningRecoveryManager {
  recover(snapshot: ReasoningSnapshot): Record<string, unknown> {
    return { ...snapshot.snapshot };
  }
}
