/**
 * @module shell/validator
 * @description Command validation for shell execution.
 * Implements allowlist checking, blocked command detection,
 * dangerous flag detection, and injection pattern detection.
 */

import { ParsedCommand, ValidationResult, ShellSandboxConfig } from './interfaces.js';
import { isProgramAllowed, isProgramBlocked, isFlagDangerous } from './allowlist.js';
import { detectInjectionPatterns } from './command-parser.js';

/**
 * Validates a parsed command against sandbox rules
 * @param parsed - The parsed command to validate
 * @param config - The shell sandbox configuration
 * @returns ValidationResult with validity and reasons
 */
export function validateCommand(parsed: ParsedCommand, config: ShellSandboxConfig): ValidationResult {
  const reasons: string[] = [];

  // 1. Check if program is blocked (highest priority)
  if (isProgramBlocked(parsed.program, config)) {
    reasons.push(`Program '${parsed.program}' is in the blocked list`);
  }

  // 2. Check if program is allowed
  if (!isProgramAllowed(parsed.program, config)) {
    reasons.push(`Program '${parsed.program}' is not in the allowlist`);
  }

  // 3. Check for dangerous flags
  for (const flag of parsed.flags) {
    if (isFlagDangerous(flag, config)) {
      reasons.push(`Dangerous flag detected: '${flag}'`);
    }
  }

  // 4. Check for injection patterns
  const injectionPatterns = detectInjectionPatterns(parsed.rawCommand);
  if (injectionPatterns.length > 0) {
    reasons.push(`Injection patterns detected: ${injectionPatterns.join(', ')}`);
  }

  // 5. Check for pipe operators (shell.build should not have pipes)
  if (parsed.hasPipe) {
    reasons.push('Pipe operators are not allowed in shell commands');
  }

  // 6. Check for redirection operators (potential file manipulation)
  if (parsed.hasRedirection) {
    reasons.push('Redirection operators require explicit approval');
  }

  // 7. Check for subshell expansion (potential injection)
  if (parsed.hasSubshell) {
    reasons.push('Subshell expansion is not allowed');
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
