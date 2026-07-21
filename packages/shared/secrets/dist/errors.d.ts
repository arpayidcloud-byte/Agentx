export declare class SecretError extends Error {
    constructor(message: string);
}
export declare class SecretNotFoundError extends SecretError {
    constructor(key: string);
}
export declare class OperationNotSupportedError extends SecretError {
    constructor(operation?: string);
}
export declare class SecretAccessError extends SecretError {
    constructor(message?: string);
}
export declare class CredentialResolutionError extends SecretError {
    constructor(logicalKey: string);
}
//# sourceMappingURL=errors.d.ts.map