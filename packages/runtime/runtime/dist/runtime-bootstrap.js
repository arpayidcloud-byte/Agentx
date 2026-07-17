/**
 * @module runtime/runtime-bootstrap
 * @description Runtime bootstrap configuration and setup.
 */
import { createRuntimeConfig, createResourceLimits } from './runtime-config.js';
export function createBootstrapConfig(options = {}) {
    const config = createRuntimeConfig(options.config);
    return {
        config,
        resourceLimits: createResourceLimits(config),
        enableHooks: options.enableHooks !== false,
        enableAudit: options.enableAudit !== false,
        enableMetrics: options.enableMetrics !== false,
    };
}
//# sourceMappingURL=runtime-bootstrap.js.map