export class CoreRuntimeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class IllegalStateTransitionError extends CoreRuntimeError {
  constructor(taskId: string, from: string, to: string) {
    super(`Task ${taskId} cannot transition from ${from} to ${to}`, 'ILLEGAL_STATE_TRANSITION');
  }
}

export class TaskNotFoundError extends CoreRuntimeError {
  constructor(taskId: string) {
    super(`Task not found: ${taskId}`, 'TASK_NOT_FOUND');
  }
}

export class DuplicateTaskError extends CoreRuntimeError {
  constructor(taskId: string) {
    super(`Task already exists: ${taskId}`, 'DUPLICATE_TASK');
  }
}

export class EventBusError extends CoreRuntimeError {
  constructor(message: string) {
    super(message, 'EVENT_BUS_ERROR');
  }
}
