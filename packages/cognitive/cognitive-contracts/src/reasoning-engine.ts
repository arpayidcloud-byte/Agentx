/**
 * @module cognitive-contracts/reasoning-engine
 * @description Reasoning engine contract implementation base.
 */

import type { IReasoningEngine, ReasoningResult } from './contracts.js';
import type { ReasoningContext } from './interfaces.js';

export class ReasoningEngineBase implements IReasoningEngine {
  async reason(_context: ReasoningContext, _input: string): Promise<ReasoningResult> {
    return {
      thoughtProcess: [],
      conclusion: '',
      confidenceScore: 0,
    };
  }
}
