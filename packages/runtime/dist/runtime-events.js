/**
 * @module runtime/runtime-events
 * @description Runtime event types for EventBus integration.
 */
export function createRuntimeEvent(type, runtimeId, traceId, payload = {}) {
    return { type, runtimeId, traceId, timestamp: new Date(), payload };
}
//# sourceMappingURL=runtime-events.js.map