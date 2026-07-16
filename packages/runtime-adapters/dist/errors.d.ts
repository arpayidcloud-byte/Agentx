/**
 * @module runtime-adapters/errors
 * @description Error classes for Production Adapter Layer.
 */
export declare class AdapterError extends Error {
    readonly code: string;
    readonly source: string;
    constructor(message: string, code: string, source: string);
}
export declare class ProviderResolutionError extends AdapterError {
    constructor(message: string, source: string);
}
export declare class ProviderUnavailableError extends AdapterError {
    constructor(message: string, source: string);
}
export declare class UnsupportedProviderCapabilityError extends AdapterError {
    constructor(message: string, source: string);
}
//# sourceMappingURL=errors.d.ts.map