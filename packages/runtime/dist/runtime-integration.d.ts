/**
 * @module runtime/runtime-integration
 * @description Integration layer matching the runtime configuration.
 */
import { RuntimeDI } from './runtime-di.js';
import { RuntimeBootstrapConfig } from './runtime-bootstrap-v2.js';
import { PipelineResult } from './execution-pipeline.js';
import { RuntimeHealthReport } from './runtime-health-v2.js';
import { ObservabilityMetrics } from './runtime-observability.js';
import { RecoveryAction } from './runtime-recovery.js';
export declare class RuntimeIntegration {
    private di;
    constructor(config?: RuntimeBootstrapConfig);
    private init;
    executeGoal(sessionId: string, goal: string): Promise<PipelineResult>;
    getHealthReport(): Promise<RuntimeHealthReport>;
    getMetrics(): Promise<ObservabilityMetrics>;
    getRecoveryHistory(): RecoveryAction[];
    getDI(): RuntimeDI;
}
//# sourceMappingURL=runtime-integration.d.ts.map