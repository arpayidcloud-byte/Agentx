/**
 * @module shell/process-manager
 * @description Process management for shell execution.
 * Uses child_process.spawn() ONLY - never exec() or execSync().
 * Implements process lifecycle management with abort support.
 */
import { spawn } from 'child_process';
import { createEmptyOutput } from './output.js';
/**
 * Manages a spawned shell process
 */
export class ProcessManager {
    process = null;
    output = createEmptyOutput();
    startTime = 0;
    resourceLimits;
    constructor(resourceLimits) {
        this.resourceLimits = resourceLimits;
    }
    /**
     * Spawns a process with the given command and arguments
     * @param command - The program to execute
     * @param args - Arguments to pass
     * @param options - Spawn options
     * @returns Promise that resolves with collected output
     */
    async spawn(command, args, options) {
        return new Promise((resolve) => {
            this.startTime = Date.now();
            let stdoutData = '';
            let stderrData = '';
            let stdoutTruncated = false;
            let stderrTruncated = false;
            const maxOutputBytes = this.resourceLimits.maxOutputBytes;
            try {
                this.process = spawn(command, args, {
                    cwd: options.cwd,
                    env: options.env,
                    stdio: ['ignore', 'pipe', 'pipe'],
                    detached: false,
                });
                // Handle stdout
                this.process.stdout?.on('data', (data) => {
                    const chunk = data.toString();
                    if (stdoutData.length + chunk.length > maxOutputBytes) {
                        const remaining = maxOutputBytes - stdoutData.length;
                        if (remaining > 0) {
                            stdoutData += chunk.slice(0, remaining);
                        }
                        stdoutTruncated = true;
                        this.process?.stdout?.destroy();
                    }
                    else {
                        stdoutData += chunk;
                    }
                    options.onStdout?.(chunk);
                });
                // Handle stderr
                this.process.stderr?.on('data', (data) => {
                    const chunk = data.toString();
                    if (stderrData.length + chunk.length > maxOutputBytes) {
                        const remaining = maxOutputBytes - stderrData.length;
                        if (remaining > 0) {
                            stderrData += chunk.slice(0, remaining);
                        }
                        stderrTruncated = true;
                        this.process?.stderr?.destroy();
                    }
                    else {
                        stderrData += chunk;
                    }
                    options.onStderr?.(chunk);
                });
                // Handle process exit
                this.process.on('close', (code, signal) => {
                    const durationMs = Date.now() - this.startTime;
                    this.output = {
                        stdout: stdoutTruncated ? stdoutData + '\n[OUTPUT TRUNCATED]' : stdoutData,
                        stderr: stderrTruncated ? stderrData + '\n[OUTPUT TRUNCATED]' : stderrData,
                        exitCode: code ?? 1,
                        signal: signal ?? undefined,
                        durationMs,
                        truncated: stdoutTruncated || stderrTruncated,
                    };
                    resolve(this.output);
                });
                // Handle process error
                this.process.on('error', (error) => {
                    const durationMs = Date.now() - this.startTime;
                    this.output = {
                        stdout: stdoutData,
                        stderr: stderrData + '\n' + error.message,
                        exitCode: 1,
                        durationMs,
                        truncated: false,
                    };
                    resolve(this.output);
                });
                // Handle abort signal
                if (options.signal) {
                    options.signal.addEventListener('abort', () => {
                        this.kill('SIGTERM');
                    });
                }
            }
            catch (error) {
                const durationMs = Date.now() - this.startTime;
                this.output = {
                    stdout: '',
                    stderr: error instanceof Error ? error.message : String(error),
                    exitCode: 1,
                    durationMs,
                    truncated: false,
                };
                resolve(this.output);
            }
        });
    }
    /**
     * Kills the current process
     * @param signal - Signal to send (default: SIGTERM)
     */
    kill(signal = 'SIGTERM') {
        if (this.process && !this.process.killed) {
            try {
                this.process.kill(signal);
            }
            catch {
                // Process already terminated
            }
        }
    }
    /**
     * Gets the current collected output
     * @returns Current CollectedOutput
     */
    getOutput() {
        return { ...this.output };
    }
    /**
     * Checks if the process is currently running
     * @returns true if process is running
     */
    isRunning() {
        return this.process !== null && !this.process.killed;
    }
}
//# sourceMappingURL=process-manager.js.map