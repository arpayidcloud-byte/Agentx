/**
 * @module runtime/audit-postgres
 * @description Postgres-backed audit store implementation.
 */
export class PostgresAuditStore {
    _connectionString;
    constructor(connectionString) {
        this._connectionString = connectionString;
    }
    getConnectionString() {
        return this._connectionString;
    }
    async record(audit) {
        // Future: INSERT INTO audit_records ...
        this.records.set(audit.id, { ...audit, timestamp: audit.timestamp || new Date() });
    }
    async getAll() {
        return Array.from(this.records.values());
    }
    async getByTraceId(traceId) {
        return Array.from(this.records.values()).filter(r => r.traceId === traceId);
    }
    async getBySessionId(sessionId) {
        return Array.from(this.records.values()).filter(r => r.sessionId === sessionId);
    }
    async getByWorkflowId(workflowId) {
        return Array.from(this.records.values()).filter(r => r.workflowId === workflowId);
    }
    async delete(id) {
        this.records.delete(id);
    }
    records = new Map();
}
//# sourceMappingURL=audit-postgres.js.map