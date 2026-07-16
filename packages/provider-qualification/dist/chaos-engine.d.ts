/**
 * @module provider-qualification/chaos-engine
 * @description Injects chaos triggers to test resilience.
 */
import { ChaosResult } from './interfaces.js';
export declare class ChaosEngine {
    simulateFailure(failures: string[]): Promise<ChaosResult>;
}
//# sourceMappingURL=chaos-engine.d.ts.map