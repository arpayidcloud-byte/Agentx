/// <reference types="node" resolution-mode="require"/>
import { BaseProvider } from '../../base-provider.js';
import type { CompletionRequest, CompletionResponse, ProviderCapabilities, ProviderConfiguration } from '../../interfaces.js';
import type { CredentialResolver } from '../../conformance/credential-resolver.js';
export interface AnthropicProviderConfig extends ProviderConfiguration {
    credentialResolver: CredentialResolver;
}
export declare class AnthropicProvider extends BaseProvider {
    readonly capabilities: ProviderCapabilities;
    private credentialResolver;
    constructor(config: AnthropicProviderConfig);
    protected doComplete(req: CompletionRequest, signal: AbortSignal): Promise<CompletionResponse>;
    protected mapError(error: unknown): Error;
}
//# sourceMappingURL=index.d.ts.map