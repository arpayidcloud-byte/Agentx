/**
 * @module shell/output
 * @description Output collection for shell execution.
 * Collects stdout, stderr, exit code, signal, and duration.
 */
/**
 * Creates an empty collected output
 * @returns Empty CollectedOutput
 */
export function createEmptyOutput() {
    return {
        stdout: '',
        stderr: '',
        exitCode: 0,
        durationMs: 0,
        truncated: false,
    };
}
/**
 * Truncates output to fit within size limit
 * @param output - Output string to truncate
 * @param maxLength - Maximum length in bytes
 * @returns Truncated output
 */
export function truncateOutput(output, maxLength) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(output);
    if (encoded.length <= maxLength) {
        return { output, truncated: false };
    }
    const truncated = new TextDecoder().decode(encoded.slice(0, maxLength));
    return { output: truncated + '\n[OUTPUT TRUNCATED]', truncated: true };
}
//# sourceMappingURL=output.js.map