/**
 * @module runtime/runtime-hooks
 * @description Runtime lifecycle hooks.
 */
import type { RuntimeState, RuntimeSession, RuntimeMetrics } from './interfaces.js';
export interface RuntimeHook {
    name: string;
    beforeStart?: (session: RuntimeSession) => Promise<void>;
    afterStart?: (session: RuntimeSession) => Promise<void>;
    beforeComplete?: (session: RuntimeSession, result: unknown) => Promise<void>;
    afterComplete?: (session: RuntimeSession, metrics: RuntimeMetrics) => Promise<void>;
    onError?: (session: RuntimeSession, error: Error) => Promise<void>;
    onStateChange?: (session: RuntimeSession, from: RuntimeState, to: RuntimeState) => Promise<void>;
}
export declare class RuntimeHookManager {
    private hooks;
    register(hook: RuntimeHook): void;
    unregister(hookName: string): void;
    executeBeforeStart(session: RuntimeSession): Promise<void>;
    executeAfterStart(session: RuntimeSession): Promise<void>;
    executeBeforeComplete(session: RuntimeSession, result: unknown): Promise<void>;
    executeAfterComplete(session: RuntimeSession, metrics: RuntimeMetrics): Promise<void>;
    executeOnStateChange(session: RuntimeSession, from: RuntimeState, to: RuntimeState): Promise<void>;
    executeOnError(session: RuntimeSession, error: Error): Promise<void>;
}
//# sourceMappingURL=runtime-hooks.d.ts.map