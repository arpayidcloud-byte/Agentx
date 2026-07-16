export declare class ProviderError extends Error {
    readonly providerId: string;
    readonly originalError?: Error | undefined;
    constructor(message: string, providerId: string, originalError?: Error | undefined);
}
export declare class ProviderUnavailableError extends ProviderError {
    constructor(providerId: string, message?: string, originalError?: Error);
}
export declare class ProviderTimeoutError extends ProviderError {
    constructor(providerId: string, message?: string, originalError?: Error);
}
export declare class ProviderRateLimitError extends ProviderError {
    constructor(providerId: string, message?: string, originalError?: Error);
}
export declare class ProviderResponseMalformedError extends ProviderError {
    constructor(providerId: string, message?: string, originalError?: Error);
}
export declare class ProviderInvalidCredentialsError extends ProviderError {
    constructor(providerId: string, message?: string, originalError?: Error);
}
export declare class CircuitBreakerOpenError extends ProviderError {
    constructor(providerId: string, message?: string);
}
//# sourceMappingURL=errors.d.ts.map