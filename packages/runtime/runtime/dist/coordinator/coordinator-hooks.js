/**
 * @module coordinator/coordinator-hooks
 * @description Hook manager for execution lifecycle integration.
 */
export class CoordinatorHookManager {
    hooks = [];
    register(hook) {
        this.hooks.push(hook);
    }
    unregister(name) {
        this.hooks = this.hooks.filter((h) => h.name !== name);
    }
    async executeBeforeExecution(session) {
        for (const hook of this.hooks) {
            if (hook.beforeExecution)
                await hook.beforeExecution(session);
        }
    }
    async executeAfterExecution(session, result) {
        for (const hook of this.hooks) {
            if (hook.afterExecution)
                await hook.afterExecution(session, result);
        }
    }
    async executeOnDispatch(session, phase) {
        for (const hook of this.hooks) {
            if (hook.onDispatch)
                await hook.onDispatch(session, phase);
        }
    }
    async executeOnRetry(session, phase, attempt) {
        for (const hook of this.hooks) {
            if (hook.onRetry)
                await hook.onRetry(session, phase, attempt);
        }
    }
    clear() {
        this.hooks = [];
    }
}
//# sourceMappingURL=coordinator-hooks.js.map