/**
 * @module runtime/runtime-lifecycle
 * @description Runtime lifecycle management.
 */
import { RuntimeStateMachine } from './runtime-state.js';
export class RuntimeLifecycle {
    state = 'CREATED';
    history = [];
    getState() {
        return this.state;
    }
    transition(next) {
        if (!RuntimeStateMachine.canTransition(this.state, next)) {
            throw new Error(`Invalid state transition: ${this.state} -> ${next}`);
        }
        this.state = next;
        this.history.push({ state: next, timestamp: new Date() });
    }
    getHistory() {
        return [...this.history];
    }
    isTerminal() {
        return this.state === 'COMPLETED' || this.state === 'CANCELLED' || this.state === 'FAILED';
    }
}
//# sourceMappingURL=runtime-lifecycle.js.map