/**
 * @module workflow-engine/critical-path
 * @description CriticalPathAnalyzer for identifying bottlenecks and parallel efficiency.
 */
import { WorkflowDefinition } from './interfaces.js';
import { CriticalPathAnalysis } from './interfaces-v2.js';
export declare class CriticalPathAnalyzer {
    analyze(workflow: WorkflowDefinition): CriticalPathAnalysis;
    private findLongestChain;
    private calculateParallelEfficiency;
    private findBottlenecks;
    private calculateIdleTime;
}
//# sourceMappingURL=critical-path.d.ts.map