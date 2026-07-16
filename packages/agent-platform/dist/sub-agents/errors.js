export class AgentPlatformError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class ResourceLimitExceededError extends AgentPlatformError {
    constructor(message) {
        super(message, 'RESOURCE_LIMIT_EXCEEDED');
    }
}
export class AgentHeartbeatLostError extends AgentPlatformError {
    constructor(agentId) {
        super(`Heartbeat lost for agent ${agentId}`, 'AGENT_HEARTBEAT_LOST');
    }
}
export class AgentFailureError extends AgentPlatformError {
    constructor(agentId, reason) {
        super(`Agent ${agentId} failed: ${reason}`, 'AGENT_FAILURE');
    }
}
export class DependencyGraphError extends AgentPlatformError {
    constructor(message) {
        super(message, 'DEPENDENCY_GRAPH_ERROR');
    }
}
export class MergeConflictError extends AgentPlatformError {
    constructor(message) {
        super(message, 'MERGE_CONFLICT_ERROR');
    }
}
export class AgentTimeoutError extends AgentPlatformError {
    constructor(agentId) {
        super(`Agent ${agentId} execution timed out`, 'AGENT_TIMEOUT');
    }
}
//# sourceMappingURL=errors.js.map