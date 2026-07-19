/**
 * @module runtime/runtime-session
 * @description Session management for the runtime.
 */
import type { RuntimeSession, ExecutionSession, SessionStatus, RuntimeMetrics } from './interfaces.js';
/**
 * Creates a new runtime session
 * @param owner - Session owner
 * @returns RuntimeSession
 */
export declare function createRuntimeSession(owner: string): RuntimeSession;
/**
 * Creates a new execution session
 * @param traceId - Trace ID
 * @param goal - Execution goal
 * @returns ExecutionSession
 */
export declare function createExecutionSession(traceId: string, goal: string): ExecutionSession;
/**
 * Creates empty metrics
 * @returns RuntimeMetrics
 */
export declare function createEmptyMetrics(): RuntimeMetrics;
/**
 * Validates session state transition
 * @param current - Current status
 * @param next - Target status
 * @returns true if transition is valid
 */
export declare function canSessionTransition(current: SessionStatus, next: SessionStatus): boolean;
//# sourceMappingURL=runtime-session.d.ts.map