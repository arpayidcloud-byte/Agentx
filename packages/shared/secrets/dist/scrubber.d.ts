export declare class RedactedString {
    private readonly rawValue;
    constructor(value: string);
    toString(): string;
    toJSON(): string;
    valueOf(): string;
    [Symbol.toPrimitive](_hint: string): string;
    getRawValue(): string;
}
export declare const scrubEnvironment: (env: Record<string, string | undefined>) => Record<string, string | undefined>;
//# sourceMappingURL=scrubber.d.ts.map