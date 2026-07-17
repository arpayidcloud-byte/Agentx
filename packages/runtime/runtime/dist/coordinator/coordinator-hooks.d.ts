/**
 * @module coordinator/coordinator-hooks
 * @description Hook manager for execution lifecycle integration.
 */
import { CoordinatorHook, CoordinatorSession, ExecutionPhase } from './interfaces.js';
export declare class CoordinatorHookManager {
    private hooks;
    register(hook: CoordinatorHook): void;
    unregister(name: string): void;
    executeBeforeExecution(session: CoordinatorSession): Promise<void>;
    executeAfterExecution(session: CoordinatorSession, result: unknown): Promise<void>;
    executeOnDispatch(session: CoordinatorSession, phase: ExecutionPhase): Promise<void>;
    executeOnRetry(session: CoordinatorSession, phase: ExecutionPhase, attempt: number): Promise<void>;
    clear(): void;
}
//# sourceMappingURL=coordinator-hooks.d.ts.map