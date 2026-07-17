import { AsyncLocalStorage } from 'async_hooks';
export class TraceContext {
    static storage = new AsyncLocalStorage();
    /**
     * Run a function within a new or extended trace context.
     */
    static run(context, fn) {
        const current = this.storage.getStore() || {};
        const merged = { ...current, ...context };
        return this.storage.run(merged, fn);
    }
    /**
     * Run an asynchronous function within a new or extended trace context.
     */
    static async runAsync(context, fn) {
        const current = this.storage.getStore() || {};
        const merged = { ...current, ...context };
        return this.storage.run(merged, fn);
    }
    /**
     * Get the current trace context.
     */
    static get() {
        return this.storage.getStore();
    }
    /**
     * Create a new unique correlation ID.
     */
    static generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
//# sourceMappingURL=context.js.map