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
//# sourceMappingURL=validator.d.ts.map