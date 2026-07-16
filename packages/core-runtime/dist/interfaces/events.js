export var EventTopic;
(function (EventTopic) {
    EventTopic["TASK_CREATED"] = "task.created";
    EventTopic["TASK_QUEUED"] = "task.queued";
    EventTopic["TASK_STARTED"] = "task.started";
    EventTopic["TASK_STATE_CHANGED"] = "task.state_changed";
    EventTopic["TASK_RETRYING"] = "task.retrying";
    EventTopic["TASK_WAITING_APPROVAL"] = "task.waiting_approval";
    EventTopic["TASK_WAITING_PROVIDER"] = "task.waiting_provider";
    EventTopic["TASK_WAITING_TOOL"] = "task.waiting_tool";
    EventTopic["TASK_COMPLETED"] = "task.completed";
    EventTopic["TASK_FAILED"] = "task.failed";
    EventTopic["TASK_CANCELLED"] = "task.cancelled";
    EventTopic["TOOL_INVOKED"] = "tool.invoked";
    EventTopic["PROVIDER_CALL_COMPLETED"] = "provider.call_completed";
})(EventTopic || (EventTopic = {}));
//# sourceMappingURL=events.js.map