import { BaseProvider } from '../../base-provider.js';
import { CompletionRequest, CompletionResponse, ProviderCapabilities, ProviderConfiguration } from '../../interfaces.js';
import { CredentialResolver } from '@agentx/secrets';
export interface GoogleProviderConfig extends ProviderConfiguration {
    credentialResolver: CredentialResolver;
}
export declare class GoogleProvider extends BaseProvider {
    readonly capabilities: ProviderCapabilities;
    private credentialResolver;
    constructor(config: GoogleProviderConfig);
    protected doComplete(req: CompletionRequest): Promise<CompletionResponse>;
    protected mapError(error: unknown): Error;
}
//# sourceMappingURL=index.d.ts.map