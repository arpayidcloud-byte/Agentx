/**
 * @module workflow-engine/retry
 * @description RetryCoordinator for managing retry logic with backoff policies.
 */
import type { RetryBudget, RetryDecision } from './interfaces-v2.js';
export declare class RetryCoordinator {
    private budgets;
    private attempts;
    private defaultPolicy;
    shouldRetry(nodeId: string, error: Error, attempt: number): RetryDecision;
    getRetryBudget(nodeId: string): RetryBudget;
    recordAttempt(nodeId: string): void;
    resetBudgets(): void;
    private calculateDelay;
}
//# sourceMappingURL=retry.d.ts.map