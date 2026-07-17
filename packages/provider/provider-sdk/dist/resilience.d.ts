import { CircuitBreakerConfig, RetryPolicy } from './interfaces.js';
export declare class CircuitBreaker {
    private failures;
    private nextAttemptAt;
    private readonly config;
    constructor(config: CircuitBreakerConfig);
    isOpen(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
}
export declare const executeWithRetry: <T>(action: () => Promise<T>, policy: RetryPolicy, providerId: string, circuitBreaker?: CircuitBreaker) => Promise<T>;
//# sourceMappingURL=resilience.d.ts.map