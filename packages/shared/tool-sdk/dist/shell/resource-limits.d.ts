/**
 * @module shell/resource-limits
 * @description Resource limit management for shell execution.
 * Enforces CPU, memory, output size, and execution time limits.
 */
import type { ResourceLimitsConfig } from './interfaces.js';
/**
 * Creates a ResourceLimitsConfig with defaults
 * @param config - Partial configuration to override defaults
 * @returns Merged ResourceLimitsConfig
 */
export declare function createResourceLimits(config?: Partial<ResourceLimitsConfig>): ResourceLimitsConfig;
/**
 * Validates that output size is within limits
 * @param outputSize - Size of output in bytes
 * @param config - Resource limits configuration
 * @throws Error if output exceeds limit
 */
export declare function validateOutputSize(outputSize: number, config: ResourceLimitsConfig): void;
/**
 * Validates that execution time is within limits
 * @param executionTimeMs - Execution time in milliseconds
 * @param config - Resource limits configuration
 * @throws Error if execution time exceeds limit
 */
export declare function validateExecutionTime(executionTimeMs: number, config: ResourceLimitsConfig): void;
/**
 * Gets the default resource limits configuration
 * @returns Default ResourceLimitsConfig
 */
export declare function getDefaultResourceLimits(): ResourceLimitsConfig;
//# sourceMappingURL=resource-limits.d.ts.map