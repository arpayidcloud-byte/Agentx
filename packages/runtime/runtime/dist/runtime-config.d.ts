/**
 * @module runtime/runtime-config
 * @description Runtime configuration management.
 */
import type { RuntimeConfig, ResourceLimits } from './interfaces.js';
/**
 * Creates runtime configuration with defaults
 * @param overrides - Partial configuration to override defaults
 * @returns Merged RuntimeConfig
 */
export declare function createRuntimeConfig(overrides?: Partial<RuntimeConfig>): RuntimeConfig;
/**
 * Creates resource limits from runtime config
 * @param config - Runtime configuration
 * @returns ResourceLimits
 */
export declare function createResourceLimits(config: RuntimeConfig): ResourceLimits;
//# sourceMappingURL=runtime-config.d.ts.map