/**
 * @module provider-qualification/benchmark-engine
 * @description Latency, throughput, and system resource profiler.
 */
import { BenchmarkMetrics } from './interfaces.js';
export declare class BenchmarkEngine {
    run(_rateRps: number, durationMs: number): Promise<BenchmarkMetrics>;
}
//# sourceMappingURL=benchmark-engine.d.ts.map