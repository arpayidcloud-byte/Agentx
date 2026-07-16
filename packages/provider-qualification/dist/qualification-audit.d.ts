/**
 * @module provider-qualification/qualification-audit
 * @description Generates immutable audit logs for qualification events.
 */
export interface AuditRecord {
    id: string;
    timestamp: Date;
    traceId: string;
    provider: string;
    version: string;
    executionTimeMs: number;
    tester: string;
    environment: string;
    score: number;
    decision: 'PASS' | 'WARNING' | 'FAILED';
}
export declare class QualificationAuditLogger {
    private records;
    log(entry: AuditRecord): void;
    getAll(): AuditRecord[];
    clear(): void;
}
//# sourceMappingURL=qualification-audit.d.ts.map