/**
 * @module production-quality/snapshot-validator
 * @description Validates immutable snapshot serialization and integrity.
 */

import { ValidationResult } from './interfaces.js';

export class SnapshotValidator {
  validate(snapshot: any): ValidationResult {
    const failures: string[] = [];

    if (!Object.isFrozen(snapshot)) {
      failures.push('Snapshot is not immutable (not frozen)');
    }

    if (!snapshot.id || !snapshot.checksum) {
      failures.push('Snapshot missing mandatory identification or checksum');
    }

    return {
      passed: failures.length === 0,
      score: failures.length === 0 ? 100 : 0,
      failures,
    };
  }
}
