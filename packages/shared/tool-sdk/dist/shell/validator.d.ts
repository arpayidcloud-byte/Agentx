/**
 * @module shell/validator
 * @description Command validation for shell execution.
 * Implements allowlist checking, blocked command detection,
 * dangerous flag detection, and injection pattern detection.
 */
import type { ParsedCommand, ValidationResult, ShellSandboxConfig } from './interfaces.js';
/**
 * Validates a parsed command against sandbox rules
 * @param parsed - The parsed command to validate
 * @param config - The shell sandbox configuration
 * @returns ValidationResult with validity and reasons
 */
export declare function validateCommand(parsed: ParsedCommand, config: ShellSandboxConfig): ValidationResult;
/**
 * Validates that command arguments don't contain path traversal or out-of-workspace paths
 * @param args - Command arguments to validate
 * @param config - Shell sandbox configuration
 * @returns Array of validation failure reasons (empty if valid)
 */
export declare function validateArgumentPaths(args: string[], config: ShellSandboxConfig): string[];
//# sourceMappingURL=validator.d.ts.map