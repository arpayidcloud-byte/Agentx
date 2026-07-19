/**
 * @module runtime-adapters/memory/memory-queue
 * @description Reference in-memory queue provider.
 */
import type { IQueueProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class MemoryQueueProvider implements IQueueProvider {
    private queue;
    private total;
    private successes;
    private failures;
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    enqueue(topic: string, message: unknown, priority?: number): Promise<void>;
    dequeue(topic: string): Promise<unknown>;
    peek(topic: string): Promise<unknown>;
    ack(_topic: string, _messageId: string): Promise<void>;
    retry(_topic: string, _messageId: string): Promise<void>;
    deadLetter(_topic: string, _messageId: string): Promise<void>;
    getDepth(topic: string): Promise<number>;
    purge(topic: string): Promise<void>;
}
//# sourceMappingURL=memory-queue.d.ts.map