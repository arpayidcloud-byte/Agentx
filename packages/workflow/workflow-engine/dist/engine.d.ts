/**
 * @module workflow-engine/engine
 * @description Core workflow execution engine.
 */
import type { WorkflowDefinition, WorkflowState, NodeState, ExecutionHistoryEntry, WorkflowMetrics } from './interfaces.js';
export declare class WorkflowStateMachine {
    private static readonly validTransitions;
    static canTransition(current: WorkflowState, next: WorkflowState): boolean;
}
export declare class WorkflowEngine {
    private checkpointManager;
    private nodeStates;
    private results;
    private history;
    private state;
    compile(_workflow: WorkflowDefinition): void;
    execute(workflow: WorkflowDefinition): Promise<WorkflowMetrics>;
    pause(): void;
    resume(): void;
    cancel(): void;
    getState(): WorkflowState;
    getNodeState(nodeId: string): NodeState | undefined;
    getHistory(): ExecutionHistoryEntry[];
    private saveCheckpoint;
    private executeNode;
    private buildMetrics;
}
//# sourceMappingURL=engine.d.ts.map