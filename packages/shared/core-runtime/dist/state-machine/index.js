import { TaskStatus } from '../interfaces/task.js';
import { IllegalStateTransitionError } from '../errors.js';
export class TaskStateMachine {
    static validTransitions = {
        [TaskStatus.CREATED]: new Set([TaskStatus.QUEUED, TaskStatus.CANCELLED]),
        [TaskStatus.QUEUED]: new Set([TaskStatus.DECOMPOSING, TaskStatus.PLANNING, TaskStatus.RUNNING, TaskStatus.CANCELLED]),
        [TaskStatus.DECOMPOSING]: new Set([TaskStatus.PLANNING, TaskStatus.FAILED, TaskStatus.CANCELLED]),
        [TaskStatus.PLANNING]: new Set([TaskStatus.RUNNING, TaskStatus.FAILED, TaskStatus.CANCELLED]),
        [TaskStatus.RUNNING]: new Set([
            TaskStatus.WAITING_APPROVAL,
            TaskStatus.WAITING_PROVIDER,
            TaskStatus.WAITING_TOOL,
            TaskStatus.COMPLETED,
            TaskStatus.FAILED,
            TaskStatus.CANCELLED,
        ]),
        [TaskStatus.WAITING_APPROVAL]: new Set([TaskStatus.RUNNING, TaskStatus.FAILED, TaskStatus.CANCELLED]),
        [TaskStatus.WAITING_PROVIDER]: new Set([TaskStatus.RUNNING, TaskStatus.FAILED, TaskStatus.RETRYING, TaskStatus.CANCELLED]),
        [TaskStatus.WAITING_TOOL]: new Set([TaskStatus.RUNNING, TaskStatus.FAILED, TaskStatus.RETRYING, TaskStatus.CANCELLED]),
        [TaskStatus.RETRYING]: new Set([TaskStatus.QUEUED, TaskStatus.RUNNING, TaskStatus.FAILED, TaskStatus.CANCELLED]),
        [TaskStatus.COMPLETED]: new Set([]), // Terminal
        [TaskStatus.FAILED]: new Set([TaskStatus.QUEUED]), // Can be manually retried from UI
        [TaskStatus.CANCELLED]: new Set([]), // Terminal
    };
    static canTransition(current, next) {
        const allowed = this.validTransitions[current];
        return allowed ? allowed.has(next) : false;
    }
    static transition(task, next) {
        if (!this.canTransition(task.status, next)) {
            throw new IllegalStateTransitionError(task.id, task.status, next);
        }
        task.status = next;
        task.updatedAt = new Date();
        return task;
    }
}
//# sourceMappingURL=index.js.map