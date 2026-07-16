/**
 * @module shell/sandbox
 * @description Shell sandbox implementation.
 * Enforces workspace jail, CWD validation, command validation,
 * environment scrubbing, timeout, resource limits, and audit integration.
 */
import { ShellExecutionContext, ShellExecutionRequest, ParsedCommand } from './interfaces.js';
/**
 * Shell sandbox that enforces security policies
 */
export declare class ShellSandbox {
    private config;
    private context;
    constructor(context: ShellExecutionContext);
    /**
     * Validates a shell execution request
     * @param request - The execution request to validate
     * @returns Parsed command structure
     * @throws Various errors if validation fails
     */
    validate(request: ShellExecutionRequest): Promise<ParsedCommand>;
    /**
     * Validates a working directory
     * @param directory - Directory to validate
     * @throws InvalidWorkingDirectoryError if directory is invalid
     */
    private validateWorkingDirectory;
    /**
     * Validates that a directory is within the workspace jail
     * @param directory - Directory to validate
     * @throws InvalidWorkingDirectoryError if directory escapes workspace
     */
    private validateWorkspaceJail;
    /**
     * Checks if a command is allowed
     * @param command - Command to check
     * @returns true if allowed
     */
    isCommandAllowed(command: string): boolean;
    /**
     * Gets the effective environment (scrubbed)
     * @returns Scrubbed environment variables
     */
    getScrubbedEnvironment(): Record<string, string | undefined>;
}
//# sourceMappingURL=sandbox.d.ts.map