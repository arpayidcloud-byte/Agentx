/**
 * @module runtime/audit-store
 * @description Abstract audit store interface and in-memory implementation.
 */
export interface AuditRecord {
    id: string;
    traceId: string;
    correlationId: string;
    sessionId: string;
    workflowId: string;
    agentId?: string;
    toolId?: string;
    approvalId?: string;
    timestamp: Date;
    durationMs: number;
    result: 'success' | 'failure' | 'cancelled';
    metadata: Record<string, unknown>;
}
export interface IAuditStore {
    record(audit: AuditRecord): Promise<void>;
    getAll(): Promise<AuditRecord[]>;
    getByTraceId(traceId: string): Promise<AuditRecord[]>;
    getBySessionId(sessionId: string): Promise<AuditRecord[]>;
    getByWorkflowId(workflowId: string): Promise<AuditRecord[]>;
    delete(id: string): Promise<void>;
}
export declare class InMemoryAuditStore implements IAuditStore {
    private records;
    record(audit: AuditRecord): Promise<void>;
    getAll(): Promise<AuditRecord[]>;
    getByTraceId(traceId: string): Promise<AuditRecord[]>;
    getBySessionId(sessionId: string): Promise<AuditRecord[]>;
    getByWorkflowId(workflowId: string): Promise<AuditRecord[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=audit-store.d.ts.map