/**
 * @module provider-qualification/qualification-audit
 * @description Generates immutable audit logs for qualification events.
 */
export class QualificationAuditLogger {
    records = [];
    log(entry) {
        this.records.push(Object.freeze({ ...entry, timestamp: new Date() }));
    }
    getAll() {
        return [...this.records];
    }
    clear() {
        this.records = [];
    }
}
//# sourceMappingURL=qualification-audit.js.map