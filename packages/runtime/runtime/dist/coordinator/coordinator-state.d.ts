/**
 * @module coordinator/coordinator-state
 * @description State machine for the Production Execution Coordinator.
 */
import type { ExecutionCoordinatorState } from './interfaces.js';
export declare class CoordinatorStateMachine {
    private currentState;
    private history;
    getState(): ExecutionCoordinatorState;
    transition(next: ExecutionCoordinatorState): void;
    canTransition(next: ExecutionCoordinatorState): boolean;
    getValidTransitions(): ExecutionCoordinatorState[];
    isTerminal(): boolean;
    getHistory(): Array<{
        from: ExecutionCoordinatorState;
        to: ExecutionCoordinatorState;
        timestamp: Date;
    }>;
    reset(): void;
}
//# sourceMappingURL=coordinator-state.d.ts.map