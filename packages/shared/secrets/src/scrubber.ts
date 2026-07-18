export class RedactedString {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public getRawValue(): string {
    return this.value;
  }

  public toString(): string {
    return '[REDACTED]';
  }

  public toJSON(): string {
    return '[REDACTED]';
  }

  public valueOf(): string {
    return '[REDACTED]';
  }

  public [Symbol.toPrimitive](_hint: string): string {
    return '[REDACTED]';
  }
}

/**
 * Scrubs any keys starting with AGENTX_SECRET_ from the environment object.
 * Returns a new object to avoid mutating the original unless desired.
 */
export function scrubEnvironment(
  env: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const scrubbed: Record<string, string | undefined> = {};
  for (const key of Object.keys(env)) {
    if (!key.startsWith('AGENTX_SECRET_')) {
      scrubbed[key] = env[key];
    }
  }
  return scrubbed;
}
