/**
 * @module workflow-engine/hooks
 * @description Workflow hook registration and management.
 */
export class WorkflowHookManager {
    hooks = [];
    register(hook) {
        this.hooks.push(hook);
    }
    unregister(hookName) {
        this.hooks = this.hooks.filter(h => h.name !== hookName);
    }
    async executeBeforeHooks(workflow) {
        for (const hook of this.hooks) {
            if (hook.beforeWorkflow)
                await hook.beforeWorkflow(workflow);
        }
    }
    async executeAfterHooks(workflow, metrics) {
        for (const hook of this.hooks) {
            if (hook.afterWorkflow)
                await hook.afterWorkflow(workflow, metrics);
        }
    }
    async executeBeforeNodeHook(node) {
        for (const hook of this.hooks) {
            if (hook.beforeNode)
                await hook.beforeNode(node);
        }
    }
    async executeAfterNodeHook(node, result) {
        for (const hook of this.hooks) {
            if (hook.afterNode)
                await hook.afterNode(node, result);
        }
    }
    async executeRetryHook(node, attempt) {
        for (const hook of this.hooks) {
            if (hook.onRetry)
                await hook.onRetry(node, attempt);
        }
    }
    async executeFailureHook(node, error) {
        for (const hook of this.hooks) {
            if (hook.onFailure)
                await hook.onFailure(node, error);
        }
    }
}
//# sourceMappingURL=hooks.js.map