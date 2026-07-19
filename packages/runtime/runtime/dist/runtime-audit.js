/**
 * @module runtime/runtime-audit
 * @description Audit trail for all runtime actions.
 */
/**
 * In-memory audit store
 */
export class AuditStore {
    records = [];
    /**
     * Records an audit entry
     * @param record - The audit record
     */
    record(record) {
        this.records.push({
            ...record,
            timestamp: record.timestamp || new Date(),
        });
    }
    /**
     * Gets all records
     * @returns Array of audit records
     */
    getAll() {
        return [...this.records];
    }
    /**
     * Gets records by trace ID
     * @param traceId - Trace ID
     * @returns Filtered records
     */
    getByTraceId(traceId) {
        return this.records.filter((r) => r.traceId === traceId);
    }
    /**
     * Gets records by session ID
     * @param sessionId - Session ID
     * @returns Filtered records
     */
    getBySessionId(sessionId) {
        return this.records.filter((r) => r.sessionId === sessionId);
    }
    /**
     * Gets records by workflow ID
     * @param workflowId - Workflow ID
     * @returns Filtered records
     */
    getByWorkflowId(workflowId) {
        return this.records.filter((r) => r.workflowId === workflowId);
    }
    /**
     * Clears all records
     */
    clear() {
        this.records = [];
    }
}
/**
 * Creates an audit record
 * @param partial - Partial record data
 * @returns Complete AuditRecord
 */
export function createAuditRecord(partial) {
    return {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        traceId: '',
        correlationId: '',
        sessionId: '',
        workflowId: '',
        timestamp: new Date(),
        durationMs: 0,
        result: 'success',
        metadata: {},
        ...partial,
    };
}
//# sourceMappingURL=runtime-audit.js.map