/**
 * @module provider-qualification/provider-score
 * @description Scoring matrix calculation.
 */
export class ProviderScoreCalculator {
    calculate(components) {
        const overall = (components.contract +
            components.compatibility +
            components.performance +
            components.reliability +
            components.security) /
            5;
        return {
            contractScore: components.contract,
            compatibilityScore: components.compatibility,
            performanceScore: components.performance,
            reliabilityScore: components.reliability,
            securityScore: components.security,
            overallScore: overall,
        };
    }
}
//# sourceMappingURL=provider-score.js.map