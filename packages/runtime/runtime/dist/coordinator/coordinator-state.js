/**
 * @module coordinator/coordinator-state
 * @description State machine for the Production Execution Coordinator.
 */
import { CoordinatorStateError } from './errors.js';
const validTransitions = {
    CREATED: ['INITIALIZING'],
    INITIALIZING: ['READY', 'FAILED'],
    READY: ['SCHEDULING', 'CANCELLED'],
    SCHEDULING: ['DISPATCHING', 'PAUSED', 'FAILED', 'CANCELLED'],
    DISPATCHING: ['EXECUTING', 'FAILED', 'CANCELLED'],
    EXECUTING: ['COMPLETED', 'WAITING_APPROVAL', 'RECOVERING', 'FAILED', 'PAUSED', 'CANCELLED'],
    WAITING_APPROVAL: ['EXECUTING', 'FAILED', 'CANCELLED'],
    RECOVERING: ['EXECUTING', 'FAILED', 'CANCELLED'],
    PAUSED: ['SCHEDULING', 'CANCELLED'],
    COMPLETED: [],
    FAILED: ['RECOVERING', 'CANCELLED'],
    CANCELLED: [],
};
export class CoordinatorStateMachine {
    currentState = 'CREATED';
    history = [];
    getState() {
        return this.currentState;
    }
    transition(next) {
        if (!this.canTransition(next)) {
            throw new CoordinatorStateError(`Invalid transition from ${this.currentState} to ${next}`, 'state-machine');
        }
        const from = this.currentState;
        this.currentState = next;
        this.history.push({ from, to: next, timestamp: new Date() });
    }
    canTransition(next) {
        return validTransitions[this.currentState]?.includes(next) ?? false;
    }
    getValidTransitions() {
        return validTransitions[this.currentState] || [];
    }
    isTerminal() {
        return (this.currentState === 'COMPLETED' ||
            this.currentState === 'FAILED' ||
            this.currentState === 'CANCELLED');
    }
    getHistory() {
        return [...this.history];
    }
    reset() {
        this.currentState = 'CREATED';
        this.history = [];
    }
}
//# sourceMappingURL=coordinator-state.js.map