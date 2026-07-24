/**
 * @module core-runtime/interfaces/events
 * @description Event bus interfaces and types for the AgentX runtime.
 */
/**
 * Well-known event topics in the AgentX system.
 *
 * @example
 * ```ts
 * await eventBus.publish(EventTopic.TASK_CREATED, taskData, traceId);
 * ```
 */
export var EventTopic;
(function (EventTopic) {
    /** A new task has been created */
    EventTopic["TASK_CREATED"] = "task.created";
    /** A task has been added to the queue */
    EventTopic["TASK_QUEUED"] = "task.queued";
    /** A task has started execution */
    EventTopic["TASK_STARTED"] = "task.started";
    /** A task has changed its lifecycle state */
    EventTopic["TASK_STATE_CHANGED"] = "task.state_changed";
    /** A task is retrying after a failure */
    EventTopic["TASK_RETRYING"] = "task.retrying";
    /** A task is waiting for user approval */
    EventTopic["TASK_WAITING_APPROVAL"] = "task.waiting_approval";
    /** A task requires approval before proceeding */
    EventTopic["TASK_APPROVAL_REQUIRED"] = "task.approval_required";
    /** An approval decision has been made */
    EventTopic["TASK_APPROVAL_RESOLVED"] = "task.approval_resolved";
    /** A task is waiting for an external provider */
    EventTopic["TASK_WAITING_PROVIDER"] = "task.waiting_provider";
    /** A task is waiting for a tool response */
    EventTopic["TASK_WAITING_TOOL"] = "task.waiting_tool";
    /** A task has completed successfully */
    EventTopic["TASK_COMPLETED"] = "task.completed";
    /** A task has failed */
    EventTopic["TASK_FAILED"] = "task.failed";
    /** A task was cancelled */
    EventTopic["TASK_CANCELLED"] = "task.cancelled";
    /** A tool has been invoked */
    EventTopic["TOOL_INVOKED"] = "tool.invoked";
    /** A provider call has completed */
    EventTopic["PROVIDER_CALL_COMPLETED"] = "provider.call_completed";
})(EventTopic || (EventTopic = {}));
//# sourceMappingURL=events.js.map