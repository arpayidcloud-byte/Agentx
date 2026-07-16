/**
 * @module shell/environment
 * @description Environment variable scrubber for shell execution.
 * Removes secrets and sensitive data from process environment.
 * Implements Threat Model T-002 mitigation.
 */
import { EnvironmentScrubberConfig } from './interfaces.js';
/**
 * Creates a scrubbed copy of the environment
 * @param original - Original process environment
 * @param config - Scrubber configuration
 * @returns Scrubbed environment object
 */
export declare function scrubEnvironment(original: Record<string, string | undefined>, config: EnvironmentScrubberConfig): Record<string, string | undefined>;
/**
 * Creates a default scrubber configuration
 * @returns Default EnvironmentScrubberConfig
 */
export declare function createDefaultScrubberConfig(): EnvironmentScrubberConfig;
//# sourceMappingURL=environment.d.ts.map