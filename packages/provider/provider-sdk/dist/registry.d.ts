import { Provider, ProviderFailoverPolicy, CompletionRequest, CompletionResponse } from './interfaces.js';
export declare class ProviderRegistry {
    private providers;
    private failoverPolicies;
    register(provider: Provider): void;
    registerFailoverPolicy(policy: ProviderFailoverPolicy): void;
    get(providerId: string): Provider | undefined;
    list(): Provider[];
    complete(providerId: string, req: CompletionRequest): Promise<CompletionResponse>;
}
//# sourceMappingURL=registry.d.ts.map