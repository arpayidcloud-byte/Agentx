/**
 * @module runtime/runtime-audit
 * @description Audit trail for all runtime actions.
 */
import { AuditRecord } from './interfaces.js';
/**
 * In-memory audit store
 */
export declare class AuditStore {
    private records;
    /**
     * Records an audit entry
     * @param record - The audit record
     */
    record(record: AuditRecord): void;
    /**
     * Gets all records
     * @returns Array of audit records
     */
    getAll(): AuditRecord[];
    /**
     * Gets records by trace ID
     * @param traceId - Trace ID
     * @returns Filtered records
     */
    getByTraceId(traceId: string): AuditRecord[];
    /**
     * Gets records by session ID
     * @param sessionId - Session ID
     * @returns Filtered records
     */
    getBySessionId(sessionId: string): AuditRecord[];
    /**
     * Gets records by workflow ID
     * @param workflowId - Workflow ID
     * @returns Filtered records
     */
    getByWorkflowId(workflowId: string): AuditRecord[];
    /**
     * Clears all records
     */
    clear(): void;
}
/**
 * Creates an audit record
 * @param partial - Partial record data
 * @returns Complete AuditRecord
 */
export declare function createAuditRecord(partial: Partial<AuditRecord>): AuditRecord;
//# sourceMappingURL=runtime-audit.d.ts.map