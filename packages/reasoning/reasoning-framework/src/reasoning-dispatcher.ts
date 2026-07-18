/**
 * @module reasoning-framework/reasoning-dispatcher
 * @description Strategy dispatcher.
 */

import type { IReasoningStrategy, ReasoningGraph } from './interfaces.js';
import { StrategyError } from './errors.js';

export class ReasoningDispatcher {
  async dispatch(strategy: IReasoningStrategy, graph: ReasoningGraph): Promise<ReasoningGraph> {
    try {
      return await strategy.execute(graph);
    } catch (err: any) {
      throw new StrategyError(`Strategy dispatch failed: ${err.message}`, 'dispatcher');
    }
  }
}
