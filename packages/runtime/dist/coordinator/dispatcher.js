/**
 * @module coordinator/dispatcher
 * @description Execution Dispatcher for delegating tasks to engines via interfaces.
 */
import { CoordinatorExecutionError } from './errors.js';
export class ExecutionDispatcher {
    engines = new Map();
    registerEngine(phase, engine) {
        this.engines.set(phase, engine);
    }
    async dispatch(ticket) {
        const engine = this.engines.get(ticket.phase);
        if (!engine) {
            throw new CoordinatorExecutionError(`No engine registered for phase ${ticket.phase}`, 'dispatcher');
        }
        return engine.execute(ticket);
    }
}
//# sourceMappingURL=dispatcher.js.map