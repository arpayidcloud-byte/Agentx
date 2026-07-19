import type { CredentialResolver } from './interfaces.js';

export interface SecretAccessEvent {
  readonly timestamp: Date;
  readonly operation: 'resolve' | 'resolveMetadata' | 'invalidate' | 'rotate' | 'invalidateAll';
  readonly key: string;
  readonly success: boolean;
  readonly error?: string;
  readonly durationMs: number;
}

export type AuditSink = (event: SecretAccessEvent) => void;

export class AuditedCredentialResolver implements CredentialResolver {
  private inner: CredentialResolver;
  private auditSink: AuditSink;

  constructor(inner: CredentialResolver, auditSink: AuditSink) {
    this.inner = inner;
    this.auditSink = auditSink;
  }

  async resolve(logicalKey: string): Promise<string> {
    const start = Date.now();
    try {
      const value = await this.inner.resolve(logicalKey);
      this.emit('resolve', logicalKey, true, Date.now() - start);
      return value;
    } catch (err) {
      this.emit('resolve', logicalKey, false, Date.now() - start, String(err));
      throw err;
    }
  }

  async resolveMetadata(logicalKey: string): Promise<import('./interfaces.js').SecretMetadata> {
    const start = Date.now();
    try {
      const metadata = await this.inner.resolveMetadata(logicalKey);
      this.emit('resolveMetadata', logicalKey, true, Date.now() - start);
      return metadata;
    } catch (err) {
      this.emit('resolveMetadata', logicalKey, false, Date.now() - start, String(err));
      throw err;
    }
  }

  async invalidate(logicalKey: string): Promise<void> {
    const start = Date.now();
    try {
      await this.inner.invalidate(logicalKey);
      this.emit('invalidate', logicalKey, true, Date.now() - start);
    } catch (err) {
      this.emit('invalidate', logicalKey, false, Date.now() - start, String(err));
      throw err;
    }
  }

  async invalidateAll(): Promise<void> {
    const start = Date.now();
    try {
      await this.inner.invalidateAll();
      this.emit('invalidateAll', '*', true, Date.now() - start);
    } catch (err) {
      this.emit('invalidateAll', '*', false, Date.now() - start, String(err));
      throw err;
    }
  }

  private emit(operation: SecretAccessEvent['operation'], key: string, success: boolean, durationMs: number, error?: string): void {
    this.auditSink({
      timestamp: new Date(),
      operation,
      key,
      success,
      durationMs,
      error,
    });
  }
}
