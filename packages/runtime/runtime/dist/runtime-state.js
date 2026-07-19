/**
 * @module runtime/runtime-state
 * @description Runtime lifecycle state machine.
 */
export class RuntimeStateMachine {
    static validTransitions = {
        CREATED: ['INITIALIZING'],
        INITIALIZING: ['PLANNING', 'FAILED'],
        PLANNING: ['RUNNING', 'FAILED', 'CANCELLED'],
        RUNNING: [
            'EXECUTING',
            'WAITING_APPROVAL',
            'COMPLETED',
            'FAILED',
            'CANCELLED',
            'RECOVERING',
            'CHECKPOINTING',
            'RUNNING',
        ],
        WAITING_APPROVAL: ['RUNNING', 'EXECUTING', 'FAILED', 'CANCELLED'],
        EXECUTING: ['CHECKPOINTING', 'COMPLETED', 'FAILED', 'RECOVERING'],
        CHECKPOINTING: ['EXECUTING', 'COMPLETED'],
        COMPLETED: [],
        FAILED: ['RECOVERING', 'CANCELLED'],
        CANCELLED: [],
        RECOVERING: ['RUNNING', 'FAILED'],
    };
    static canTransition(current, next) {
        return this.validTransitions[current]?.includes(next) ?? false;
    }
    static getValidTransitions(state) {
        return this.validTransitions[state] || [];
    }
}
//# sourceMappingURL=runtime-state.js.map