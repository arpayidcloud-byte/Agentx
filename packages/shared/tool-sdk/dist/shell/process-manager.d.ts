/**
 * @module shell/process-manager
 * @description Process management for shell execution.
 * Uses child_process.spawn() ONLY - never exec() or execSync().
 * Implements process lifecycle management with abort support.
 */
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { CollectedOutput } from './output.js';
import type { ResourceLimitsConfig } from './interfaces.js';
/**
 * Manages a spawned shell process
 */
export declare class ProcessManager {
    private process;
    private output;
    private startTime;
    private resourceLimits;
    constructor(resourceLimits: ResourceLimitsConfig);
    /**
     * Spawns a process with the given command and arguments
     * @param command - The program to execute
     * @param args - Arguments to pass
     * @param options - Spawn options
     * @returns Promise that resolves with collected output
     */
    spawn(command: string, args: string[], options: {
        cwd?: string;
        env?: Record<string, string>;
        signal?: AbortSignal;
        onStdout?: (data: string) => void;
        onStderr?: (data: string) => void;
    }): Promise<CollectedOutput>;
    /**
     * Kills the current process
     * @param signal - Signal to send (default: SIGTERM)
     */
    kill(signal?: NodeJS.Signals): void;
    /**
     * Gets the current collected output
     * @returns Current CollectedOutput
     */
    getOutput(): CollectedOutput;
    /**
     * Checks if the process is currently running
     * @returns true if process is running
     */
    isRunning(): boolean;
}
//# sourceMappingURL=process-manager.d.ts.map