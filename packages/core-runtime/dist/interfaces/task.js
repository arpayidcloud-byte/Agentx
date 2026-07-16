export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["CREATED"] = "CREATED";
    TaskStatus["QUEUED"] = "QUEUED";
    TaskStatus["DECOMPOSING"] = "DECOMPOSING";
    TaskStatus["PLANNING"] = "PLANNING";
    TaskStatus["RUNNING"] = "RUNNING";
    TaskStatus["WAITING_APPROVAL"] = "WAITING_APPROVAL";
    TaskStatus["WAITING_PROVIDER"] = "WAITING_PROVIDER";
    TaskStatus["WAITING_TOOL"] = "WAITING_TOOL";
    TaskStatus["RETRYING"] = "RETRYING";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["FAILED"] = "FAILED";
    TaskStatus["CANCELLED"] = "CANCELLED";
})(TaskStatus || (TaskStatus = {}));
export var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    TaskPriority[TaskPriority["CRITICAL"] = 3] = "CRITICAL";
})(TaskPriority || (TaskPriority = {}));
//# sourceMappingURL=task.js.map