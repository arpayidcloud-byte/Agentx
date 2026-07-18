import type { IRetryPolicy } from '../interfaces/scheduler.js';
import type { CancellationToken } from '../cancellation/index.js';
export declare class RetryPolicy implements IRetryPolicy {
    readonly type: 'exponential' | 'linear' | 'constant';
    readonly maxAttempts: number;
    readonly initialDelayMs: number;
    readonly backoffMultiplier: number;
    readonly maxDelayMs?: number;
    private retryableErrors;
    constructor(config?: {
        type?: 'exponential' | 'linear' | 'constant';
        maxAttempts?: number;
        initialDelayMs?: number;
        backoffMultiplier?: number;
        maxDelayMs?: number;
        retryableErrors?: string[];
    });
    calculateDelay(attempt: number): number;
    isRetryable(error: Error): boolean;
    execute<T>(operation: () => Promise<T>, cancellationToken?: CancellationToken): Promise<T>;
}
//# sourceMappingURL=index.d.ts.map