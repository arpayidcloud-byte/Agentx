export class SecretRedactor {
    static REDACTED_STRING = '[REDACTED]';
    // Basic keys that should trigger redaction
    static SENSITIVE_KEYS = new Set([
        'password',
        'secret',
        'token',
        'api_key',
        'apikey',
        'authorization',
        'bearer',
        'jwt',
        'private_key',
        'privatekey',
        'client_secret',
        'clientsecret',
        'access_token',
        'refreshtoken',
        'refresh_token',
    ]);
    // Basic regex for potential secrets (e.g. JWTs, generic secrets)
    static JWT_PATTERN = /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g;
    static AGENTX_SECRET_PATTERN = /AGENTX_SECRET_[A-Z0-9_]+/g;
    // A generic high-entropy base64/hex pattern for keys could be added, 
    // but targeting specific known prefixes or lengths is safer to avoid false positives.
    /**
     * Recursively redact an object or string
     */
    static redact(target) {
        if (target == null) {
            return target;
        }
        if (typeof target === 'string') {
            return this.redactString(target);
        }
        if (Array.isArray(target)) {
            return target.map((item) => this.redact(item));
        }
        if (typeof target === 'object') {
            // Don't redact standard Error objects completely, just their messages/stacks
            if (target instanceof Error) {
                const errorRecord = {
                    name: target.name,
                    message: this.redactString(target.message),
                    stack: target.stack ? this.redactString(target.stack) : undefined,
                };
                // Some errors have custom properties (e.g., code)
                for (const [key, val] of Object.entries(target)) {
                    if (!['name', 'message', 'stack'].includes(key)) {
                        errorRecord[key] = this.redactKeyVal(key, val);
                    }
                }
                return errorRecord;
            }
            const redactedObj = {};
            for (const [key, value] of Object.entries(target)) {
                redactedObj[key] = this.redactKeyVal(key, value);
            }
            return redactedObj;
        }
        return target;
    }
    static redactKeyVal(key, value) {
        const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
        let isSensitiveKey = false;
        // Check if the key itself implies a secret
        for (const sensitive of this.SENSITIVE_KEYS) {
            if (normalizedKey.includes(sensitive.replace(/[-_]/g, ''))) {
                isSensitiveKey = true;
                break;
            }
        }
        // Check if it's an AGENTX_SECRET_ environment variable key
        if (key.toUpperCase().startsWith('AGENTX_SECRET_')) {
            isSensitiveKey = true;
        }
        if (isSensitiveKey) {
            return this.REDACTED_STRING;
        }
        return this.redact(value);
    }
    static redactString(val) {
        let scrubbed = val.replace(this.JWT_PATTERN, this.REDACTED_STRING);
        scrubbed = scrubbed.replace(this.AGENTX_SECRET_PATTERN, this.REDACTED_STRING);
        return scrubbed;
    }
}
//# sourceMappingURL=redactor.js.map