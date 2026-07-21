/// <reference types="node" resolution-mode="require"/>
import type { Provider, ProviderCapabilities, ProviderConfiguration, ProviderStatus, CompletionRequest, CompletionResponse } from './interfaces.js';
import { CircuitBreaker } from './resilience.js';
import { CostCalculator } from './metrics.js';
import { Tracer, Metrics } from '@agentx/observability';
export declare abstract class BaseProvider implements Provider {
    readonly id: string;
    abstract readonly capabilities: ProviderCapabilities;
    protected config: ProviderConfiguration;
    protected circuitBreaker?: CircuitBreaker;
    protected costCalculator: CostCalculator;
    protected tracer: Tracer;
    protected otelMetrics: Metrics;
    constructor(config: ProviderConfiguration);
    complete(req: CompletionRequest): Promise<CompletionResponse>;
    checkHealth(): Promise<ProviderStatus>;
    protected generateRequestId(): string;
    protected abstract doComplete(req: CompletionRequest, signal: AbortSignal): Promise<CompletionResponse>;
    protected abstract mapError(error: unknown): Error;
}
//# sourceMappingURL=base-provider.d.ts.map