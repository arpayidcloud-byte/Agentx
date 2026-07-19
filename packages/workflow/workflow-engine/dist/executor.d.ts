/**
 * @module workflow-engine/executor
 * @description WorkflowExecutor separates orchestration from execution.
 */
import type { WorkflowDefinition } from './interfaces.js';
import type { ExtendedWorkflowMetrics, WorkflowHook, ExecutionTimelineEntry } from './interfaces-v2.js';
export declare class WorkflowExecutor {
    private nodeExecutor;
    private planner;
    private retryCoordinator;
    private checkpointManager;
    private hooks;
    constructor();
    addHook(hook: WorkflowHook): void;
    executeWorkflow(workflow: WorkflowDefinition, onStateChange: (state: string) => void): Promise<ExtendedWorkflowMetrics>;
    getTimeline(): ExecutionTimelineEntry[];
}
//# sourceMappingURL=executor.d.ts.map