/**
 * @module core-runtime/interfaces/task
 * @description Task model and related types for the AgentX runtime.
 */
/**
 * Represents the lifecycle status of a task.
 *
 * @example
 * ```ts
 * const status: TaskStatus = TaskStatus.RUNNING;
 * ```
 */
export var TaskStatus;
(function (TaskStatus) {
    /** Task has been created but not yet queued */
    TaskStatus["CREATED"] = "CREATED";
    /** Task is queued and waiting to be processed */
    TaskStatus["QUEUED"] = "QUEUED";
    /** Task is being decomposed into subtasks */
    TaskStatus["DECOMPOSING"] = "DECOMPOSING";
    /** Task is in the planning phase */
    TaskStatus["PLANNING"] = "PLANNING";
    /** Task is currently being executed */
    TaskStatus["RUNNING"] = "RUNNING";
    /** Task is waiting for user approval */
    TaskStatus["WAITING_APPROVAL"] = "WAITING_APPROVAL";
    /** Task is waiting for an external provider */
    TaskStatus["WAITING_PROVIDER"] = "WAITING_PROVIDER";
    /** Task is waiting for a tool response */
    TaskStatus["WAITING_TOOL"] = "WAITING_TOOL";
    /** Task is retrying after a failure */
    TaskStatus["RETRYING"] = "RETRYING";
    /** Task has completed successfully */
    TaskStatus["COMPLETED"] = "COMPLETED";
    /** Task has failed */
    TaskStatus["FAILED"] = "FAILED";
    /** Task was cancelled */
    TaskStatus["CANCELLED"] = "CANCELLED";
})(TaskStatus || (TaskStatus = {}));
/**
 * Priority levels for task scheduling.
 *
 * @example
 * ```ts
 * const priority: TaskPriority = TaskPriority.HIGH;
 * ```
 */
export var TaskPriority;
(function (TaskPriority) {
    /** Low priority (0) */
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    /** Normal priority (1) */
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    /** High priority (2) */
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    /** Critical priority (3) */
    TaskPriority[TaskPriority["CRITICAL"] = 3] = "CRITICAL";
})(TaskPriority || (TaskPriority = {}));
//# sourceMappingURL=task.js.map