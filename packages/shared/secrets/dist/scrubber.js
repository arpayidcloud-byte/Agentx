export class RedactedString {
    value;
    constructor(value) {
        this.value = value;
    }
    getRawValue() {
        return this.value;
    }
    toString() {
        return '[REDACTED]';
    }
    toJSON() {
        return '[REDACTED]';
    }
    valueOf() {
        return '[REDACTED]';
    }
    [Symbol.toPrimitive](_hint) {
        return '[REDACTED]';
    }
}
/**
 * Scrubs any keys starting with AGENTX_SECRET_ from the environment object.
 * Returns a new object to avoid mutating the original unless desired.
 */
export function scrubEnvironment(env) {
    const scrubbed = {};
    for (const key of Object.keys(env)) {
        if (!key.startsWith('AGENTX_SECRET_')) {
            scrubbed[key] = env[key];
        }
    }
    return scrubbed;
}
//# sourceMappingURL=scrubber.js.map