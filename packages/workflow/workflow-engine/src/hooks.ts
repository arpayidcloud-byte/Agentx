/**
 * @module workflow-engine/hooks
 * @description Workflow hook registration and management.
 */

import type { WorkflowHook } from './interfaces-v2.js';

export class WorkflowHookManager {
  private hooks: WorkflowHook[] = [];

  public register(hook: WorkflowHook): void {
    this.hooks.push(hook);
  }

  public unregister(hookName: string): void {
    this.hooks = this.hooks.filter((h) => h.name !== hookName);
  }

  public async executeBeforeHooks(workflow: any): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeWorkflow) await hook.beforeWorkflow(workflow);
    }
  }

  public async executeAfterHooks(workflow: any, metrics: any): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterWorkflow) await hook.afterWorkflow(workflow, metrics);
    }
  }

  public async executeBeforeNodeHook(node: any): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeNode) await hook.beforeNode(node);
    }
  }

  public async executeAfterNodeHook(node: any, result: unknown): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterNode) await hook.afterNode(node, result);
    }
  }

  public async executeRetryHook(node: any, attempt: number): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onRetry) await hook.onRetry(node, attempt);
    }
  }

  public async executeFailureHook(node: any, error: Error): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onFailure) await hook.onFailure(node, error);
    }
  }
}
