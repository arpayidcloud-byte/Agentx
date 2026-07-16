/**
 * @module shell/timeout
 * @description Timeout management for shell execution using AbortController/AbortSignal.
 * Default timeout is 60 seconds, configurable per Volume 7.
 */
/// <reference types="node" resolution-mode="require"/>
import { TimeoutConfig } from './interfaces.js';
/**
 * Creates an AbortController with timeout
 * @param config - Timeout configuration
 * @returns Object with AbortController and cleanup function
 */
export declare function createTimeoutController(config?: Partial<TimeoutConfig>): {
    controller: AbortController;
    cleanup: () => void;
};
/**
 * Gets the default timeout configuration
 * @returns Default TimeoutConfig
 */
export declare function getDefaultTimeoutConfig(): TimeoutConfig;
//# sourceMappingURL=timeout.d.ts.map