/**
 * @module coordinator/coordinator-events
 * @description Event factory and publishers for the Production Execution Coordinator.
 */
export function createCoordinatorEvent(type, sessionId, traceId, payload = {}) {
    return {
        type,
        timestamp: new Date(),
        sessionId,
        traceId,
        payload,
    };
}
//# sourceMappingURL=coordinator-events.js.map