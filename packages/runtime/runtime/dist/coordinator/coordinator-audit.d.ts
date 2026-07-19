/**
 * @module coordinator/coordinator-audit
 * @description Immutable audit log generation for coordinator events.
 */
import type { CoordinatorAuditRecord, ExecutionPhase } from './interfaces.js';
export declare class CoordinatorAuditLogger {
    private records;
    log(sessionId: string, traceId: string, action: string, phase: ExecutionPhase, result: 'success' | 'failure' | 'cancelled', metadata?: Record<string, unknown>): CoordinatorAuditRecord;
    getRecords(): CoordinatorAuditRecord[];
    clear(): void;
}
//# sourceMappingURL=coordinator-audit.d.ts.map