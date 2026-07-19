/**
 * @module workflow-engine/executor
 * @description WorkflowExecutor separates orchestration from execution.
 */
import type { ExtendedWorkflowMetrics, WorkflowHook } from './interfaces-v2.js';
export declare class WorkflowExecutor {
    private nodeExecutor;
    private planner;
    private retryCoordinator;
    private checkpointManager;
    private hooks;
    constructor();
    addHook(hook: WorkflowHook): void;
    executeWorkflow(workflow: any, onStateChange: (state: string) => void): Promise<ExtendedWorkflowMetrics>;
    getTimeline(): any[];
}
//# sourceMappingURL=executor.d.ts.map