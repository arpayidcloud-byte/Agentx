import { LogContext } from '../logger/interfaces.js';
export declare class TraceContext {
    private static storage;
    /**
     * Run a function within a new or extended trace context.
     */
    static run<T>(context: LogContext, fn: () => T): T;
    /**
     * Run an asynchronous function within a new or extended trace context.
     */
    static runAsync<T>(context: LogContext, fn: () => Promise<T>): Promise<T>;
    /**
     * Get the current trace context.
     */
    static get(): LogContext | undefined;
    /**
     * Create a new unique correlation ID.
     */
    static generateId(): string;
}
//# sourceMappingURL=context.d.ts.map