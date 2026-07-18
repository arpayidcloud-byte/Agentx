/**
 * @module production-quality/deterministic-validator
 * @description Validates identical inputs produce identical outputs without hidden states.
 */

import { ValidationResult } from './interfaces.js';
import { DeterministicError } from './errors.js';
import { createHash } from 'crypto';

export class DeterministicValidator {
  validate(outputs: any[]): ValidationResult {
    if (outputs.length < 2) return { passed: true, score: 100, failures: [] };

    const hash = (obj: any) => createHash('sha256').update(JSON.stringify(obj)).digest('hex');
    const firstHash = hash(outputs[0]);

    for (let i = 1; i < outputs.length; i++) {
      if (hash(outputs[i]) !== firstHash) {
        throw new DeterministicError(
          `Non-deterministic output detected at run ${i}`,
          'deterministic-validator',
        );
      }
    }

    return { passed: true, score: 100, failures: [] };
  }
}
