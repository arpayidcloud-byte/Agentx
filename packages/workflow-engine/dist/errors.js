/**
 * @module workflow-engine/errors
 * @description Error types for Workflow Engine.
 */
export class WorkflowError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class WorkflowCompilationError extends WorkflowError {
    constructor(message) {
        super(message, 'WORKFLOW_COMPILATION_ERROR');
    }
}
export class WorkflowValidationError extends WorkflowError {
    constructor(message) {
        super(message, 'WORKFLOW_VALIDATION_ERROR');
    }
}
export class CycleDetectedError extends WorkflowError {
    constructor(message = 'Cycle detected in workflow graph') {
        super(message, 'CYCLE_DETECTED');
    }
}
export class DeadlockDetectedError extends WorkflowError {
    constructor(message = 'Deadlock detected in workflow execution') {
        super(message, 'DEADLOCK_DETECTED');
    }
}
export class NodeNotFoundError extends WorkflowError {
    constructor(nodeId) {
        super(`Node not found: ${nodeId}`, 'NODE_NOT_FOUND');
    }
}
export class WorkflowExecutionError extends WorkflowError {
    constructor(nodeId, reason) {
        super(`Execution failed at node ${nodeId}: ${reason}`, 'WORKFLOW_EXECUTION_ERROR');
    }
}
export class WorkflowTimeoutError extends WorkflowError {
    constructor(workflowId, timeoutMs) {
        super(`Workflow ${workflowId} timed out after ${timeoutMs}ms`, 'WORKFLOW_TIMEOUT');
    }
}
export class SnapshotError extends WorkflowError {
    constructor(message) {
        super(message, 'SNAPSHOT_ERROR');
    }
}
export class ResumeError extends WorkflowError {
    constructor(message) {
        super(message, 'RESUME_ERROR');
    }
}
//# sourceMappingURL=errors.js.map