/**
 * @module cognitive-contracts/reasoning-context
 * @description Reasoning context contract base implementation.
 */

import { ReasoningContext } from './interfaces.js';

export class ReasoningContextBase {
  private context: ReasoningContext;

  constructor(context: ReasoningContext) {
    this.context = context;
  }

  getContext(): ReasoningContext {
    return { ...this.context };
  }
}
