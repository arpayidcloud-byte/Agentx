import type { ProviderMetrics, ModelMetadata, TokenUsage } from './interfaces.js';
export declare class CostCalculator {
    private pricingTable;
    constructor(customPricing?: Record<string, ModelMetadata>);
    getModelMetadata(providerId: string, modelId: string): ModelMetadata | undefined;
    calculateCost(providerId: string, modelId: string, usage: TokenUsage): number;
    createMetrics(traceId: string | undefined, requestId: string, providerId: string, modelId: string, latencyMs: number, usage: TokenUsage): ProviderMetrics;
}
//# sourceMappingURL=metrics.d.ts.map