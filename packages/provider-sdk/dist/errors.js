export class ProviderError extends Error {
    providerId;
    originalError;
    constructor(message, providerId, originalError) {
        super(message);
        this.providerId = providerId;
        this.originalError = originalError;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class ProviderUnavailableError extends ProviderError {
    constructor(providerId, message = 'Provider service is unavailable.', originalError) {
        super(message, providerId, originalError);
    }
}
export class ProviderTimeoutError extends ProviderError {
    constructor(providerId, message = 'Provider request timed out.', originalError) {
        super(message, providerId, originalError);
    }
}
export class ProviderRateLimitError extends ProviderError {
    constructor(providerId, message = 'Provider rate limit exceeded.', originalError) {
        super(message, providerId, originalError);
    }
}
export class ProviderResponseMalformedError extends ProviderError {
    constructor(providerId, message = 'Provider returned a malformed response.', originalError) {
        super(message, providerId, originalError);
    }
}
export class ProviderInvalidCredentialsError extends ProviderError {
    constructor(providerId, message = 'Provider credentials are invalid or missing.', originalError) {
        super(message, providerId, originalError);
    }
}
export class CircuitBreakerOpenError extends ProviderError {
    constructor(providerId, message = 'Provider circuit breaker is open.') {
        super(message, providerId);
    }
}
//# sourceMappingURL=errors.js.map