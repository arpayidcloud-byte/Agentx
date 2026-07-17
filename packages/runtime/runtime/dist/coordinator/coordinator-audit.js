/**
 * @module coordinator/coordinator-audit
 * @description Immutable audit log generation for coordinator events.
 */
export class CoordinatorAuditLogger {
    records = [];
    log(sessionId, traceId, action, phase, result, metadata = {}) {
        const record = {
            id: `coord-audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            timestamp: new Date(),
            sessionId,
            traceId,
            action,
            phase,
            result,
            metadata: Object.freeze({ ...metadata }),
        };
        this.records.push(Object.freeze(record));
        return record;
    }
    getRecords() {
        return [...this.records];
    }
    clear() {
        this.records = [];
    }
}
//# sourceMappingURL=coordinator-audit.js.map