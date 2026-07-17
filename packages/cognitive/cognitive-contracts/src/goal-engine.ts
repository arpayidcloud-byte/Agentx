/**
 * @module cognitive-contracts/goal-engine
 * @description Goal evaluation engine contract implementation base.
 */

import { IGoalEngine, GoalResult } from './contracts.js';

export class GoalEngineBase implements IGoalEngine {
  async evaluateGoal(goalId: string): Promise<GoalResult> {
    return {
      goalId,
      status: 'abandoned',
      evidence: [],
    };
  }
}
