/**
 * @module shell/resource-limits
 * @description Resource limit management for shell execution.
 * Enforces CPU, memory, output size, and execution time limits.
 */
/** Default resource limits */
const DEFAULT_RESOURCE_LIMITS = {
    maxCpuTimeMs: 30000, // 30 seconds CPU time
    maxMemoryBytes: 512 * 1024 * 1024, // 512 MB
    maxOutputBytes: 10 * 1024 * 1024, // 10 MB
    maxExecutionTimeMs: 60000, // 60 seconds execution time
};
/**
 * Creates a ResourceLimitsConfig with defaults
 * @param config - Partial configuration to override defaults
 * @returns Merged ResourceLimitsConfig
 */
export function createResourceLimits(config = {}) {
    return { ...DEFAULT_RESOURCE_LIMITS, ...config };
}
/**
 * Validates that output size is within limits
 * @param outputSize - Size of output in bytes
 * @param config - Resource limits configuration
 * @throws Error if output exceeds limit
 */
export function validateOutputSize(outputSize, config) {
    if (outputSize > config.maxOutputBytes) {
        throw new Error(`Output size ${outputSize} exceeds limit of ${config.maxOutputBytes} bytes`);
    }
}
/**
 * Validates that execution time is within limits
 * @param executionTimeMs - Execution time in milliseconds
 * @param config - Resource limits configuration
 * @throws Error if execution time exceeds limit
 */
export function validateExecutionTime(executionTimeMs, config) {
    if (executionTimeMs > config.maxExecutionTimeMs) {
        throw new Error(`Execution time ${executionTimeMs}ms exceeds limit of ${config.maxExecutionTimeMs}ms`);
    }
}
/**
 * Gets the default resource limits configuration
 * @returns Default ResourceLimitsConfig
 */
export function getDefaultResourceLimits() {
    return { ...DEFAULT_RESOURCE_LIMITS };
}
//# sourceMappingURL=resource-limits.js.map