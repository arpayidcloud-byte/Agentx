/**
 * @module provider-qualification/errors
 * @description Qualification framework errors.
 */
export class QualificationError extends Error {
    code;
    source;
    constructor(message, code, source) {
        super(message);
        this.code = code;
        this.source = source;
        this.name = 'QualificationError';
    }
}
export class ContractValidationError extends QualificationError {
    constructor(message, source) {
        super(message, 'CONTRACT_VALIDATION_ERROR', source);
        this.name = 'ContractValidationError';
    }
}
export class CompatibilityValidationError extends QualificationError {
    constructor(message, source) {
        super(message, 'COMPATIBILITY_VALIDATION_ERROR', source);
        this.name = 'CompatibilityValidationError';
    }
}
export class QualificationRegistryError extends QualificationError {
    constructor(message, source) {
        super(message, 'REGISTRY_ERROR', source);
        this.name = 'QualificationRegistryError';
    }
}
//# sourceMappingURL=errors.js.map