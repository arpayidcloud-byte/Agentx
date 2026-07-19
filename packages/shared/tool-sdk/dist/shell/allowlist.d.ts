/**
 * @module shell/allowlist
 * @description Command allowlist management for shell execution.
 * Reads configuration from agentx.config.yaml per Volume 9 Chapter 5.
 */
import type { ShellSandboxConfig } from './interfaces.js';
/**
 * Loads shell sandbox configuration from agentx.config.yaml
 * @returns ShellSandboxConfig with merged defaults
 */
export declare function loadShellConfig(configPath?: string): Promise<ShellSandboxConfig>;
/**
 * Checks if a program is in the allowlist
 * @param program - The program name to check
 * @param config - The shell sandbox configuration
 * @returns true if the program is allowed
 */
export declare function isProgramAllowed(program: string, config: ShellSandboxConfig): boolean;
/**
 * Checks if a program is in the blocked list
 * @param program - The program name to check
 * @param config - The shell sandbox configuration
 * @returns true if the program is blocked
 */
export declare function isProgramBlocked(program: string, config: ShellSandboxConfig): boolean;
/**
 * Checks if a flag is dangerous
 * @param flag - The flag to check
 * @param config - The shell sandbox configuration
 * @returns true if the flag is dangerous
 */
export declare function isFlagDangerous(flag: string, config: ShellSandboxConfig): boolean;
//# sourceMappingURL=allowlist.d.ts.map