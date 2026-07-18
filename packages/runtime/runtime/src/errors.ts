/**
 * @module runtime/errors
 * @description Hierarchical runtime errors.
 */

export class RuntimeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RuntimeRecoverableError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'RECOVERABLE', source);
  }
}

export class RuntimeNonRecoverableError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'NON_RECOVERABLE', source);
  }
}

export class RuntimeTimeoutError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'TIMEOUT', source);
  }
}

export class RuntimeCancellationError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'CANCELLATION', source);
  }
}

export class RuntimeResourceLimitError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'RESOURCE_LIMIT', source);
  }
}

export class RuntimeWorkflowFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'WORKFLOW_FAILURE', source);
  }
}

export class RuntimeApprovalFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'APPROVAL_FAILURE', source);
  }
}

export class RuntimeAgentFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'AGENT_FAILURE', source);
  }
}

export class RuntimeToolFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'TOOL_FAILURE', source);
  }
}

export class RuntimeContextFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'CONTEXT_FAILURE', source);
  }
}

export class RuntimeMemoryFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'MEMORY_FAILURE', source);
  }
}

export class RuntimeKnowledgeFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'KNOWLEDGE_FAILURE', source);
  }
}

export class RuntimePlannerFailureError extends RuntimeError {
  constructor(message: string, source: string) {
    super(message, 'PLANNER_FAILURE', source);
  }
}
