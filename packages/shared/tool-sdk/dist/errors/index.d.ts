export declare class ToolError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
export declare class ToolNotFoundError extends ToolError {
    constructor(toolName: string);
}
export declare class DuplicateToolError extends ToolError {
    constructor(toolName: string);
}
export declare class PermissionDeniedError extends ToolError {
    constructor(agentRole: string, category: string, reason: string);
}
export declare class SchemaValidationError extends ToolError {
    constructor(errors: string[]);
}
export declare class ManifestValidationError extends ToolError {
    constructor(message: string);
}
export declare class SandboxViolationError extends ToolError {
    constructor(message: string);
}
export declare class CapabilityViolationError extends ToolError {
    constructor(message: string);
}
//# sourceMappingURL=index.d.ts.map