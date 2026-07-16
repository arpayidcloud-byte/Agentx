export class CoreRuntimeError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class IllegalStateTransitionError extends CoreRuntimeError {
    constructor(taskId, from, to) {
        super(`Task ${taskId} cannot transition from ${from} to ${to}`, 'ILLEGAL_STATE_TRANSITION');
    }
}
export class TaskNotFoundError extends CoreRuntimeError {
    constructor(taskId) {
        super(`Task not found: ${taskId}`, 'TASK_NOT_FOUND');
    }
}
export class DuplicateTaskError extends CoreRuntimeError {
    constructor(taskId) {
        super(`Task already exists: ${taskId}`, 'DUPLICATE_TASK');
    }
}
export class EventBusError extends CoreRuntimeError {
    constructor(message) {
        super(message, 'EVENT_BUS_ERROR');
    }
}
//# sourceMappingURL=errors.js.map