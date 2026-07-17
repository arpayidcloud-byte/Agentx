/**
 * @module coordinator/coordinator-context
 * @description Context management with trace propagation and correlation.
 */
export function createCoordinatorContext(traceId, sessionId, executionId, correlationId) {
    return {
        traceId,
        sessionId,
        executionId,
        correlationId: correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        metadata: {},
    };
}
export function extendCoordinatorContext(ctx, updates) {
    return {
        ...ctx,
        ...updates,
        metadata: { ...ctx.metadata, ...updates.metadata },
    };
}
//# sourceMappingURL=coordinator-context.js.map