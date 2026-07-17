/**
 * @module runtime/runtime-bootstrap
 * @description Runtime bootstrap configuration and setup.
 */
import { RuntimeConfig, ResourceLimits } from './interfaces.js';
export interface BootstrapOptions {
    config?: Partial<RuntimeConfig>;
    enableHooks?: boolean;
    enableAudit?: boolean;
    enableMetrics?: boolean;
}
export declare function createBootstrapConfig(options?: BootstrapOptions): {
    config: RuntimeConfig;
    resourceLimits: ResourceLimits;
    enableHooks: boolean;
    enableAudit: boolean;
    enableMetrics: boolean;
};
//# sourceMappingURL=runtime-bootstrap.d.ts.map