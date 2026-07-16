export declare class AgentPlatformError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
export declare class ResourceLimitExceededError extends AgentPlatformError {
    constructor(message: string);
}
export declare class AgentHeartbeatLostError extends AgentPlatformError {
    constructor(agentId: string);
}
export declare class AgentFailureError extends AgentPlatformError {
    constructor(agentId: string, reason: string);
}
export declare class DependencyGraphError extends AgentPlatformError {
    constructor(message: string);
}
export declare class MergeConflictError extends AgentPlatformError {
    constructor(message: string);
}
export declare class AgentTimeoutError extends AgentPlatformError {
    constructor(agentId: string);
}
//# sourceMappingURL=errors.d.ts.map