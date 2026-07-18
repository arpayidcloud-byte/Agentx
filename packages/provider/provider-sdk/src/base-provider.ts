import {
  Provider,
  ProviderCapabilities,
  ProviderConfiguration,
  ProviderStatus,
  CompletionRequest,
  CompletionResponse,
} from './interfaces.js';
import { CircuitBreaker, executeWithRetry } from './resilience.js';
import { CostCalculator } from './metrics.js';
import { ProviderTimeoutError } from './errors.js';

export abstract class BaseProvider implements Provider {
  public readonly id: string;
  public abstract readonly capabilities: ProviderCapabilities;

  protected config: ProviderConfiguration;
  protected circuitBreaker?: CircuitBreaker;
  protected costCalculator: CostCalculator;

  constructor(config: ProviderConfiguration) {
    this.id = config.providerId;
    this.config = config;
    if (config.circuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    }
    this.costCalculator = new CostCalculator();
  }

  public async complete(req: CompletionRequest): Promise<CompletionResponse> {
    const action = async () => {
      const abortController = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;

      if (req.cancellationToken) {
        req.cancellationToken.addEventListener('abort', () => abortController.abort());
      }

      if (this.config.timeoutPolicy) {
        timeoutId = setTimeout(() => {
          abortController.abort(new ProviderTimeoutError(this.id));
        }, this.config.timeoutPolicy.timeoutMs);
      }

      try {
        const start = Date.now();
        const response = await this.doComplete(req, abortController.signal);
        const latencyMs = Date.now() - start;

        const metrics = this.costCalculator.createMetrics(
          req.traceId,
          this.generateRequestId(),
          this.id,
          response.modelId,
          latencyMs,
          response.usage,
        );

        response.latencyMs = latencyMs;
        response.metrics = metrics;

        return response;
      } catch (e: any) {
        if (e.name === 'AbortError' || e instanceof ProviderTimeoutError) {
          throw new ProviderTimeoutError(this.id, undefined, e);
        }
        throw this.mapError(e);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    if (this.config.retryPolicy) {
      return executeWithRetry(action, this.config.retryPolicy, this.id, this.circuitBreaker);
    }

    if (this.circuitBreaker && this.circuitBreaker.isOpen()) {
      throw new Error('CircuitBreakerOpenError');
    }

    try {
      const res = await action();
      if (this.circuitBreaker) this.circuitBreaker.recordSuccess();
      return res;
    } catch (e) {
      if (this.circuitBreaker) this.circuitBreaker.recordFailure();
      throw e;
    }
  }

  public async checkHealth(): Promise<ProviderStatus> {
    return {
      providerId: this.id,
      health: this.circuitBreaker && this.circuitBreaker.isOpen() ? 'unhealthy' : 'healthy',
      lastCheckedAt: new Date(),
      activeCircuitBreaker: this.circuitBreaker ? this.circuitBreaker.isOpen() : false,
    };
  }

  protected generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  protected abstract doComplete(
    req: CompletionRequest,
    signal: AbortSignal,
  ): Promise<CompletionResponse>;
  protected abstract mapError(error: unknown): Error;
}
