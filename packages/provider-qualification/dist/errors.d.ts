/**
 * @module provider-qualification/errors
 * @description Qualification framework errors.
 */
export declare class QualificationError extends Error {
    readonly code: string;
    readonly source: string;
    constructor(message: string, code: string, source: string);
}
export declare class ContractValidationError extends QualificationError {
    constructor(message: string, source: string);
}
export declare class CompatibilityValidationError extends QualificationError {
    constructor(message: string, source: string);
}
export declare class QualificationRegistryError extends QualificationError {
    constructor(message: string, source: string);
}
//# sourceMappingURL=errors.d.ts.map