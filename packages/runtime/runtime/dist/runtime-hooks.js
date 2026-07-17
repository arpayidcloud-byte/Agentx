/**
 * @module runtime/runtime-hooks
 * @description Runtime lifecycle hooks.
 */
export class RuntimeHookManager {
    hooks = [];
    register(hook) {
        this.hooks.push(hook);
    }
    unregister(hookName) {
        this.hooks = this.hooks.filter(h => h.name !== hookName);
    }
    async executeBeforeStart(session) {
        for (const hook of this.hooks) {
            if (hook.beforeStart)
                await hook.beforeStart(session);
        }
    }
    async executeAfterStart(session) {
        for (const hook of this.hooks) {
            if (hook.afterStart)
                await hook.afterStart(session);
        }
    }
    async executeBeforeComplete(session, result) {
        for (const hook of this.hooks) {
            if (hook.beforeComplete)
                await hook.beforeComplete(session, result);
        }
    }
    async executeAfterComplete(session, metrics) {
        for (const hook of this.hooks) {
            if (hook.afterComplete)
                await hook.afterComplete(session, metrics);
        }
    }
    async executeOnStateChange(session, from, to) {
        for (const hook of this.hooks) {
            if (hook.onStateChange)
                await hook.onStateChange(session, from, to);
        }
    }
    async executeOnError(session, error) {
        for (const hook of this.hooks) {
            if (hook.onError)
                await hook.onError(session, error);
        }
    }
}
//# sourceMappingURL=runtime-hooks.js.map