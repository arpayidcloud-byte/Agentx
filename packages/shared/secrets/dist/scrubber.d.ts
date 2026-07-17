export declare class RedactedString {
    private readonly value;
    constructor(value: string);
    getRawValue(): string;
    toString(): string;
    toJSON(): string;
    valueOf(): string;
    [Symbol.toPrimitive](_hint: string): string;
}
/**
 * Scrubs any keys starting with AGENTX_SECRET_ from the environment object.
 * Returns a new object to avoid mutating the original unless desired.
 */
export declare function scrubEnvironment(env: Record<string, string | undefined>): Record<string, string | undefined>;
//# sourceMappingURL=scrubber.d.ts.map