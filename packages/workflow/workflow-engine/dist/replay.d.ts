/**
 * @module workflow-engine/replay
 * @description Execution replay for debugging and step-by-step analysis.
 */
import { ReplayMode, ReplaySnapshot, ReplayHistory } from './interfaces-v2.js';
export declare class ExecutionReplay {
    startReplay(workflowId: string, _mode: ReplayMode): Promise<ReplayHistory>;
    getSnapshot(_workflowId: string, step: number): Promise<ReplaySnapshot | undefined>;
    stepForward(_workflowId: string): Promise<ReplaySnapshot>;
}
//# sourceMappingURL=replay.d.ts.map