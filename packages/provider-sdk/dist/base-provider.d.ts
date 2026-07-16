/// <reference types="node" resolution-mode="require"/>
import { Provider, ProviderCapabilities, ProviderConfiguration, ProviderStatus, CompletionRequest, CompletionResponse } from './interfaces.js';
import { CircuitBreaker } from './resilience.js';
import { CostCalculator } from './metrics.js';
export declare abstract class BaseProvider implements Provider {
    readonly id: string;
    abstract readonly capabilities: ProviderCapabilities;
    protected config: ProviderConfiguration;
    protected circuitBreaker?: CircuitBreaker;
    protected costCalculator: CostCalculator;
    constructor(config: ProviderConfiguration);
    complete(req: CompletionRequest): Promise<CompletionResponse>;
    checkHealth(): Promise<ProviderStatus>;
    protected generateRequestId(): string;
    protected abstract doComplete(req: CompletionRequest, signal: AbortSignal): Promise<CompletionResponse>;
    protected abstract mapError(error: unknown): Error;
}
//# sourceMappingURL=base-provider.d.ts.map