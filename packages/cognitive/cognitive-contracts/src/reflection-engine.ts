/**
 * @module cognitive-contracts/reflection-engine
 * @description Reflection engine contract implementation base.
 */

import { IReflectionEngine, ReflectionResult } from './contracts.js';

export class ReflectionEngineBase implements IReflectionEngine {
  async reflect(_thought: string, _criteria: string[]): Promise<ReflectionResult> {
    return {
      isCorrect: false,
      critique: '',
      improvements: [],
    };
  }
}
