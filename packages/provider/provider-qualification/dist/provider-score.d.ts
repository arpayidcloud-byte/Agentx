/**
 * @module provider-qualification/provider-score
 * @description Scoring matrix calculation.
 */
import { QualificationScore } from './interfaces.js';
export declare class ProviderScoreCalculator {
    calculate(components: {
        contract: number;
        compatibility: number;
        performance: number;
        reliability: number;
        security: number;
    }): QualificationScore;
}
//# sourceMappingURL=provider-score.d.ts.map