import type { TaskModel } from '../interfaces/task.js';
import { TaskStatus } from '../interfaces/task.js';
export declare class TaskStateMachine {
    private static readonly validTransitions;
    static canTransition(current: TaskStatus, next: TaskStatus): boolean;
    static transition(task: TaskModel, next: TaskStatus): TaskModel;
}
//# sourceMappingURL=index.d.ts.map