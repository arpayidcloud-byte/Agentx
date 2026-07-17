/**
 * @module coordinator/scheduler
 * @description Scheduler for ordering, batching, and queuing execution tickets.
 */
import { ExecutionTicket, ExecutionSchedule, ExecutionBatch } from './interfaces.js';
export declare class ExecutionScheduler {
    private queue;
    private batches;
    schedule(ticket: ExecutionTicket): ExecutionSchedule;
    dequeue(): ExecutionTicket | undefined;
    peek(): ExecutionTicket | undefined;
    cancel(ticketId: string): boolean;
    createBatch(tickets: ExecutionTicket[]): ExecutionBatch;
    completeBatch(batchId: string): void;
    getQueueSize(): number;
    clear(): void;
}
//# sourceMappingURL=scheduler.d.ts.map