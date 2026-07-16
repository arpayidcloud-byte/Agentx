/**
 * @module runtime/runtime-context
 * @description Runtime context management for execution state.
 */
export function createContext(traceId, sessionId) {
    return { traceId, sessionId, metadata: {} };
}
export function extendContext(ctx, updates) {
    return { ...ctx, ...updates, metadata: { ...ctx.metadata, ...updates.metadata } };
}
//# sourceMappingURL=runtime-context.js.map