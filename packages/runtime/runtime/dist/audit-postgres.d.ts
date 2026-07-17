/**
 * @module runtime/audit-postgres
 * @description Postgres-backed audit store implementation.
 */
import { IAuditStore, AuditRecord } from './audit-store.js';
export declare class PostgresAuditStore implements IAuditStore {
    private _connectionString;
    constructor(connectionString: string);
    getConnectionString(): string;
    record(audit: AuditRecord): Promise<void>;
    getAll(): Promise<AuditRecord[]>;
    getByTraceId(traceId: string): Promise<AuditRecord[]>;
    getBySessionId(sessionId: string): Promise<AuditRecord[]>;
    getByWorkflowId(workflowId: string): Promise<AuditRecord[]>;
    delete(id: string): Promise<void>;
    private records;
}
//# sourceMappingURL=audit-postgres.d.ts.map