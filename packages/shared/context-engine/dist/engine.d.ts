import type { IContextEngine, ContextScope, ContextSnapshot, ITokenEstimator, IContextCompressor, ContextMetrics } from './interfaces.js';
import type { IEventBus } from '@agentx/core-runtime';
export declare class ContextEngine implements IContextEngine {
    private eventBus;
    private estimator;
    private compressor;
    private contexts;
    private metrics;
    constructor(eventBus: IEventBus, estimator: ITokenEstimator, compressor: IContextCompressor);
    private computeChecksum;
    createContext(scope: ContextScope, initialData?: Record<string, unknown>): Promise<ContextSnapshot>;
    updateContext(contextId: string, updates: Record<string, unknown>): Promise<ContextSnapshot>;
    getContext(contextId: string): Promise<ContextSnapshot | undefined>;
    mergeContexts(sourceIds: string[], targetScope: ContextScope): Promise<ContextSnapshot>;
    compressContext(contextId: string, targetTokens: number): Promise<ContextSnapshot>;
    validateContext(contextId: string): Promise<boolean>;
    private updateMetrics;
    getMetrics(): ContextMetrics;
}
//# sourceMappingURL=engine.d.ts.map