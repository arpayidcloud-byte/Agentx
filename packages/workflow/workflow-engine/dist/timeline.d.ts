/**
 * @module workflow-engine/timeline
 * @description Execution timeline generation for deterministic tracking.
 */
import { ExecutionTimelineEntry } from './interfaces-v2.js';
import { WorkflowNode } from './interfaces.js';
export declare class ExecutionTimeline {
    private entries;
    startNode(node: WorkflowNode): void;
    finishNode(nodeId: string, status: 'COMPLETED' | 'FAILED' | 'SKIPPED', retries?: number): void;
    getTimeline(): ExecutionTimelineEntry[];
    getDuration(): number;
    clear(): void;
}
//# sourceMappingURL=timeline.d.ts.map