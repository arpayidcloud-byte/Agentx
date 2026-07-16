import { MergeConflictError } from './errors.js';
export class MergeEngine {
    merge(outputs) {
        const merged = {};
        for (const output of outputs) {
            if (typeof output !== 'object' || output === null)
                continue;
            const record = output;
            for (const [key, val] of Object.entries(record)) {
                if (merged[key] !== undefined && JSON.stringify(merged[key]) !== JSON.stringify(val)) {
                    throw new MergeConflictError(`Conflict detected for key: ${key}`);
                }
                merged[key] = val;
            }
        }
        return merged;
    }
}
export class ConflictResolver {
    resolveConflict(_key, val1, val2, criteria) {
        if (criteria.architectOverride) {
            return val1; // Assume val1 is from architect
        }
        if (criteria.coverageScore1 !== undefined && criteria.coverageScore2 !== undefined) {
            return criteria.coverageScore1 >= criteria.coverageScore2 ? val1 : val2;
        }
        return val1;
    }
}
//# sourceMappingURL=merge-engine.js.map