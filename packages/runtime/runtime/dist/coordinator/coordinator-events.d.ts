/**
 * @module coordinator/coordinator-events
 * @description Event factory and publishers for the Production Execution Coordinator.
 */
export interface CoordinatorEvent {
    type: string;
    timestamp: Date;
    sessionId: string;
    traceId: string;
    payload: Record<string, unknown>;
}
export declare function createCoordinatorEvent(type: string, sessionId: string, traceId: string, payload?: Record<string, unknown>): CoordinatorEvent;
//# sourceMappingURL=coordinator-events.d.ts.map