export type ConsensusStrategy = 'majority' | 'weighted' | 'reviewerOverride';
export declare class ConsensusEngine {
    private strategy;
    constructor(strategy: ConsensusStrategy);
    computeConsensus(votes: Array<{
        agentRole: string;
        value: string;
        weight?: number;
    }>): string;
}
//# sourceMappingURL=consensus-engine.d.ts.map