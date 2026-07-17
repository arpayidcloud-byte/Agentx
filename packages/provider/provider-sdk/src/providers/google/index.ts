import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from '../../base-provider.js';
import {
  CompletionRequest,
  CompletionResponse,
  ProviderCapabilities,
  ProviderConfiguration,
} from '../../interfaces.js';
import { CredentialResolver } from '../../conformance/credential-resolver.js';
import {
  ProviderInvalidCredentialsError,
  ProviderError,
} from '../../errors.js';

export interface GoogleProviderConfig extends ProviderConfiguration {
  credentialResolver: CredentialResolver;
}

export class GoogleProvider extends BaseProvider {
  public readonly capabilities: ProviderCapabilities = {
    completion: true,
    chat: true,
    embedding: true,
    toolUse: true,
    streaming: true,
    vision: true,
  };

  private credentialResolver: CredentialResolver;

  constructor(config: GoogleProviderConfig) {
    super(config);
    this.credentialResolver = config.credentialResolver;
  }

  protected async doComplete(req: CompletionRequest): Promise<CompletionResponse> {
    const apiKey = await this.credentialResolver.resolve('provider.google.api_key');
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelId = req.modelId || this.config.defaultModelId;
    const model = genAI.getGenerativeModel({ model: modelId });

    // Map context
    const contents = [];
    if (req.context) {
      for (const msg of req.context) {
        if (typeof msg.content === 'string') {
          contents.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] });
        } else {
          contents.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: JSON.stringify(msg.content) }] });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: req.userPrompt }] });

    // Simplified tool mapping
    let tools;
    if (req.tools && req.tools.length > 0) {
      tools = [{
        functionDeclarations: req.tools.map(t => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        }))
      }];
    }

    const response = await model.generateContent({
      contents,
      systemInstruction: req.systemPrompt ? { role: 'system', parts: [{ text: req.systemPrompt }] } : undefined,
      tools: tools as any,
      generationConfig: {
        maxOutputTokens: req.maxTokens,
        temperature: req.temperature,
      },
    });

    const result = response.response;
    const text = result.text() || '';

    const toolCalls = [];
    const calls = (result as any).functionCalls ? (result as any).functionCalls() : [];
    if (calls) {
      for (const call of calls) {
        toolCalls.push({
          toolName: call.name,
          arguments: call.args as Record<string, unknown>,
          callId: Math.random().toString(36).substring(7),
        });
      }
    }

    const inputTokens = (result as any).usageMetadata?.promptTokenCount || 0;
    const outputTokens = (result as any).usageMetadata?.candidatesTokenCount || 0;

    return {
      text,
      toolCalls,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      providerId: this.id,
      modelId: modelId,
      latencyMs: 0,
    };
  }

  protected mapError(error: unknown): Error {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('API key not valid')) {
      return new ProviderInvalidCredentialsError(this.id, msg, error instanceof Error ? error : undefined);
    }
    // Google SDK errors are less strongly typed, using message inspection
    return new ProviderError(msg, this.id, error instanceof Error ? error : undefined);
  }
}
