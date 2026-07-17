/**
 * @module runtime/runtime-context
 * @description Runtime context management for execution state.
 */
export interface RuntimeContext {
    traceId: string;
    sessionId: string;
    workflowId?: string;
    agentId?: string;
    toolId?: string;
    metadata: Record<string, unknown>;
}
export declare function createContext(traceId: string, sessionId: string): RuntimeContext;
export declare function extendContext(ctx: RuntimeContext, updates: Partial<RuntimeContext>): RuntimeContext;
//# sourceMappingURL=runtime-context.d.ts.map