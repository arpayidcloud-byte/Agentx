/**
 * @module shell/command-parser
 * @description Shell command parser that extracts program, arguments, flags,
 * working directory, and detects dangerous patterns.
 */
import type { ParsedCommand } from './interfaces.js';
/**
 * Parses a shell command string into structured components
 * @param command - Raw command string
 * @returns Parsed command structure
 * @throws CommandParseError if parsing fails
 */
export declare function parseCommand(command: string): ParsedCommand;
/**
 * Detects dangerous patterns in a command
 * @param command - Command to check
 * @returns Array of detected pattern names
 */
export declare function detectDangerousPatterns(command: string): string[];
/**
 * Checks if a command contains any injection patterns
 * @param command - Command to check
 * @returns Array of injection pattern names
 */
export declare function detectInjectionPatterns(command: string): string[];
//# sourceMappingURL=command-parser.d.ts.map