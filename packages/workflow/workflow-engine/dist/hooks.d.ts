/**
 * @module workflow-engine/hooks
 * @description Workflow hook registration and management.
 */
import type { WorkflowDefinition, WorkflowNode, WorkflowMetrics } from './interfaces.js';
import type { WorkflowHook } from './interfaces-v2.js';
export declare class WorkflowHookManager {
    private hooks;
    register(hook: WorkflowHook): void;
    unregister(hookName: string): void;
    executeBeforeHooks(workflow: WorkflowDefinition): Promise<void>;
    executeAfterHooks(workflow: WorkflowDefinition, metrics: WorkflowMetrics): Promise<void>;
    executeBeforeNodeHook(node: WorkflowNode): Promise<void>;
    executeAfterNodeHook(node: WorkflowNode, result: unknown): Promise<void>;
    executeRetryHook(node: WorkflowNode, attempt: number): Promise<void>;
    executeFailureHook(node: WorkflowNode, error: Error): Promise<void>;
}
//# sourceMappingURL=hooks.d.ts.map