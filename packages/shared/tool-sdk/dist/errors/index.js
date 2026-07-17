export class ToolError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class ToolNotFoundError extends ToolError {
    constructor(toolName) {
        super(`Tool not found: ${toolName}`, 'TOOL_NOT_FOUND');
    }
}
export class DuplicateToolError extends ToolError {
    constructor(toolName) {
        super(`Duplicate tool detected: ${toolName}`, 'DUPLICATE_TOOL');
    }
}
export class PermissionDeniedError extends ToolError {
    constructor(agentRole, category, reason) {
        super(`Permission denied for agent ${agentRole} on category ${category}: ${reason}`, 'PERMISSION_DENIED');
    }
}
export class SchemaValidationError extends ToolError {
    constructor(errors) {
        super(`Schema validation failed: ${errors.join(', ')}`, 'SCHEMA_VALIDATION_FAILED');
    }
}
export class ManifestValidationError extends ToolError {
    constructor(message) {
        super(`Manifest validation failed: ${message}`, 'MANIFEST_VALIDATION_FAILED');
    }
}
export class SandboxViolationError extends ToolError {
    constructor(message) {
        super(`Sandbox violation: ${message}`, 'SANDBOX_VIOLATION');
    }
}
export class CapabilityViolationError extends ToolError {
    constructor(message) {
        super(`Capability violation: ${message}`, 'CAPABILITY_VIOLATION');
    }
}
//# sourceMappingURL=index.js.map