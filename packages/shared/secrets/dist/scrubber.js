export class RedactedString {
    rawValue;
    constructor(value) {
        this.rawValue = value;
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
    getRawValue() {
        return this.rawValue;
    }
}
export const scrubEnvironment = (env) => {
    const result = {};
    for (const [key, value] of Object.entries(env)) {
        if (key.startsWith('AGENTX_SECRET_')) {
            result[key] = undefined;
        }
        else {
            result[key] = value;
        }
    }
    return result;
};
//# sourceMappingURL=scrubber.js.map