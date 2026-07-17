/**
 * @module workflow-engine/hooks
 * @description Workflow hook registration and management.
 */
import { WorkflowHook } from './interfaces-v2.js';
export declare class WorkflowHookManager {
    private hooks;
    register(hook: WorkflowHook): void;
    unregister(hookName: string): void;
    executeBeforeHooks(workflow: any): Promise<void>;
    executeAfterHooks(workflow: any, metrics: any): Promise<void>;
    executeBeforeNodeHook(node: any): Promise<void>;
    executeAfterNodeHook(node: any, result: unknown): Promise<void>;
    executeRetryHook(node: any, attempt: number): Promise<void>;
    executeFailureHook(node: any, error: Error): Promise<void>;
}
//# sourceMappingURL=hooks.d.ts.map