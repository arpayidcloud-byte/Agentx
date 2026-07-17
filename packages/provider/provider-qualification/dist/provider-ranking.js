/**
 * @module provider-qualification/provider-ranking
 * @description Rank providers automatically based on score.
 */
export class ProviderRanking {
    getRank(score) {
        if (score >= 90)
            return 'GOLD';
        if (score >= 75)
            return 'SILVER';
        if (score >= 60)
            return 'BRONZE';
        if (score > 0)
            return 'EXPERIMENTAL';
        return 'REJECTED';
    }
}
//# sourceMappingURL=provider-ranking.js.map