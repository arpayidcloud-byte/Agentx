import { ProviderRateLimitError, ProviderTimeoutError, ProviderUnavailableError, CircuitBreakerOpenError, } from './errors.js';
export class CircuitBreaker {
    failures = 0;
    nextAttemptAt = 0;
    config;
    constructor(config) {
        this.config = config;
    }
    isOpen() {
        if (this.failures >= this.config.failureThreshold) {
            if (Date.now() > this.nextAttemptAt) {
                // Half-open state
                return false;
            }
            return true;
        }
        return false;
    }
    recordSuccess() {
        this.failures = 0;
    }
    recordFailure() {
        this.failures++;
        if (this.failures >= this.config.failureThreshold) {
            this.nextAttemptAt = Date.now() + this.config.resetTimeoutMs;
        }
    }
}
export const executeWithRetry = async (action, policy, providerId, circuitBreaker) => {
    let attempt = 0;
    let lastError;
    while (attempt <= policy.maxAttempts) {
        if (circuitBreaker && circuitBreaker.isOpen()) {
            throw new CircuitBreakerOpenError(providerId);
        }
        try {
            const result = await action();
            if (circuitBreaker)
                circuitBreaker.recordSuccess();
            return result;
        }
        catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e));
            const isRetryable = e instanceof ProviderRateLimitError ||
                e instanceof ProviderTimeoutError ||
                e instanceof ProviderUnavailableError;
            if (!isRetryable) {
                throw lastError; // Do not retry non-transient errors
            }
            if (circuitBreaker)
                circuitBreaker.recordFailure();
            if (attempt >= policy.maxAttempts) {
                throw lastError;
            }
            // Exponential backoff
            const delay = Math.min(policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attempt), policy.maxDelayMs || Infinity);
            // Add jitter (±10%)
            const jitter = delay * 0.1 * (Math.random() * 2 - 1);
            const actualDelay = Math.max(0, delay + jitter);
            await new Promise((resolve) => setTimeout(resolve, actualDelay));
            attempt++;
        }
    }
    throw lastError;
};
//# sourceMappingURL=resilience.js.map