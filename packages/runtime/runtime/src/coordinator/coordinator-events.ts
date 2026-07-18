/**
 * @module coordinator/coordinator-events
 * @description Event factory and publishers for the Production Execution Coordinator.
 */

export interface CoordinatorEvent {
  type: string;
  timestamp: Date;
  sessionId: string;
  traceId: string;
  payload: Record<string, any>;
}

export function createCoordinatorEvent(
  type: string,
  sessionId: string,
  traceId: string,
  payload: Record<string, any> = {},
): CoordinatorEvent {
  return {
    type,
    timestamp: new Date(),
    sessionId,
    traceId,
    payload,
  };
}
