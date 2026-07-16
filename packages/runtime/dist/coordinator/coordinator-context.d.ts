/**
 * @module coordinator/coordinator-context
 * @description Context management with trace propagation and correlation.
 */
export interface CoordinatorContext {
    traceId: string;
    correlationId: string;
    workflowId?: string;
    executionId: string;
    sessionId: string;
    metadata: Record<string, unknown>;
}
export declare function createCoordinatorContext(traceId: string, sessionId: string, executionId: string, correlationId?: string): CoordinatorContext;
export declare function extendCoordinatorContext(ctx: CoordinatorContext, updates: Partial<CoordinatorContext>): CoordinatorContext;
//# sourceMappingURL=coordinator-context.d.ts.map