/**
 * @module runtime/audit-store
 * @description Abstract audit store interface and in-memory implementation.
 */
export class InMemoryAuditStore {
    records = [];
    async record(audit) {
        this.records.push({ ...audit, timestamp: audit.timestamp || new Date() });
    }
    async getAll() {
        return [...this.records];
    }
    async getByTraceId(traceId) {
        return this.records.filter(r => r.traceId === traceId);
    }
    async getBySessionId(sessionId) {
        return this.records.filter(r => r.sessionId === sessionId);
    }
    async getByWorkflowId(workflowId) {
        return this.records.filter(r => r.workflowId === workflowId);
    }
    async delete(id) {
        this.records = this.records.filter(r => r.id !== id);
    }
}
//# sourceMappingURL=audit-store.js.map