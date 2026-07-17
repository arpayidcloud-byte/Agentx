/**
 * @module runtime-adapters/errors
 * @description Error classes for Production Adapter Layer.
 */
export class AdapterError extends Error {
    code;
    source;
    constructor(message, code, source) {
        super(message);
        this.code = code;
        this.source = source;
        this.name = 'AdapterError';
    }
}
export class ProviderResolutionError extends AdapterError {
    constructor(message, source) {
        super(message, 'PROVIDER_RESOLUTION_ERROR', source);
        this.name = 'ProviderResolutionError';
    }
}
export class ProviderUnavailableError extends AdapterError {
    constructor(message, source) {
        super(message, 'PROVIDER_UNAVAILABLE_ERROR', source);
        this.name = 'ProviderUnavailableError';
    }
}
export class UnsupportedProviderCapabilityError extends AdapterError {
    constructor(message, source) {
        super(message, 'UNSUPPORTED_PROVIDER_CAPABILITY_ERROR', source);
        this.name = 'UnsupportedProviderCapabilityError';
    }
}
//# sourceMappingURL=errors.js.map