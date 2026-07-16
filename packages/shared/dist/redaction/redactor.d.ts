export declare class SecretRedactor {
    private static readonly REDACTED_STRING;
    private static readonly SENSITIVE_KEYS;
    private static readonly JWT_PATTERN;
    private static readonly AGENTX_SECRET_PATTERN;
    /**
     * Recursively redact an object or string
     */
    static redact(target: unknown): unknown;
    private static redactKeyVal;
    private static redactString;
}
//# sourceMappingURL=redactor.d.ts.map