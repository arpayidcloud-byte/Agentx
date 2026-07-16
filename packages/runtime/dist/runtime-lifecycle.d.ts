/**
 * @module runtime/runtime-lifecycle
 * @description Runtime lifecycle management.
 */
import { RuntimeState } from './interfaces.js';
export declare class RuntimeLifecycle {
    private state;
    private history;
    getState(): RuntimeState;
    transition(next: RuntimeState): void;
    getHistory(): Array<{
        state: RuntimeState;
        timestamp: Date;
    }>;
    isTerminal(): boolean;
}
//# sourceMappingURL=runtime-lifecycle.d.ts.map