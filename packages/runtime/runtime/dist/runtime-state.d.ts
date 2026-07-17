/**
 * @module runtime/runtime-state
 * @description Runtime lifecycle state machine.
 */
import { RuntimeState } from './interfaces.js';
export declare class RuntimeStateMachine {
    private static readonly validTransitions;
    static canTransition(current: RuntimeState, next: RuntimeState): boolean;
    static getValidTransitions(state: RuntimeState): RuntimeState[];
}
//# sourceMappingURL=runtime-state.d.ts.map