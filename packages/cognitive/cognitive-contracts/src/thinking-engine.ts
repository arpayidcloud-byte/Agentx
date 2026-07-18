/**
 * @module cognitive-contracts/thinking-engine
 * @description Thinking engine contract implementation base.
 */

import type { IThinkingEngine, ReasoningResult } from './contracts.js';
import type { ThinkingSession } from './interfaces.js';

export class ThinkingEngineBase implements IThinkingEngine {
  async think(_session: ThinkingSession): Promise<ReasoningResult> {
    return {
      thoughtProcess: [],
      conclusion: '',
      confidenceScore: 0,
    };
  }
}
