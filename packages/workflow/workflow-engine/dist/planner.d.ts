/**
 * @module workflow-engine/planner
 * @description ExecutionPlanner for dependency ordering, priority calculation, and parallel batching.
 */
import type { WorkflowDefinition } from './interfaces.js';
import type { ExecutionPlan } from './interfaces-v2.js';
export declare class ExecutionPlanner {
    plan(workflow: WorkflowDefinition): ExecutionPlan;
    private computeBatches;
    calculateCriticalPath(workflow: WorkflowDefinition): string[];
    estimateParallelism(workflow: WorkflowDefinition): number;
    private estimateNodeDuration;
}
//# sourceMappingURL=planner.d.ts.map