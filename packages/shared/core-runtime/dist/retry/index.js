export class RetryPolicy {
    type;
    maxAttempts;
    initialDelayMs;
    backoffMultiplier;
    maxDelayMs;
    retryableErrors;
    constructor(config = {}) {
        this.type = config.type || 'exponential';
        this.maxAttempts = config.maxAttempts ?? 3;
        this.initialDelayMs = config.initialDelayMs ?? 1000;
        this.backoffMultiplier = config.backoffMultiplier ?? 2.0;
        this.maxDelayMs = config.maxDelayMs;
        this.retryableErrors = config.retryableErrors || [
            'ECONNRESET',
            'ETIMEDOUT',
            'EAI_AGAIN',
            '429',
            '500',
            '502',
            '503',
        ];
    }
    calculateDelay(attempt) {
        let delay = this.initialDelayMs;
        switch (this.type) {
            case 'linear':
                delay = this.initialDelayMs + this.initialDelayMs * attempt;
                break;
            case 'constant':
                delay = this.initialDelayMs;
                break;
            case 'exponential':
            default:
                delay = this.initialDelayMs * Math.pow(this.backoffMultiplier, attempt);
                break;
        }
        if (this.maxDelayMs) {
            delay = Math.min(delay, this.maxDelayMs);
        }
        // Add jitter (±20%)
        const jitter = delay * 0.2 * (Math.random() * 2 - 1);
        return Math.max(0, Math.round(delay + jitter));
    }
    isRetryable(error) {
        const msg = error.message.toUpperCase();
        return this.retryableErrors.some((code) => msg.includes(code));
    }
    async execute(operation, cancellationToken) {
        let lastError;
        for (let attempt = 0; attempt <= this.maxAttempts; attempt++) {
            if (cancellationToken?.isCancelled) {
                throw new Error(`Operation cancelled: ${cancellationToken.reason}`);
            }
            try {
                return await operation();
            }
            catch (e) {
                lastError = e instanceof Error ? e : new Error(String(e));
                if (attempt >= this.maxAttempts || !this.isRetryable(lastError)) {
                    throw lastError;
                }
                const delay = this.calculateDelay(attempt);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }
}
//# sourceMappingURL=index.js.map