/**
 * @module coordinator/dispatcher
 * @description Execution Dispatcher for delegating tasks to engines via interfaces.
 */
import { ExecutionPhase, ExecutionTicket } from './interfaces.js';
export interface IEngine {
    execute(input: unknown): Promise<unknown>;
}
export declare class ExecutionDispatcher {
    private engines;
    registerEngine(phase: ExecutionPhase, engine: IEngine): void;
    dispatch(ticket: ExecutionTicket): Promise<unknown>;
}
//# sourceMappingURL=dispatcher.d.ts.map