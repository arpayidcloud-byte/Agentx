/**
 * @module runtime-adapters/memory/memory-queue
 * @description Reference in-memory queue provider.
 */
import { IQueueProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
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
    dequeue(topic: string): Promise<unknown | undefined>;
    peek(topic: string): Promise<unknown | undefined>;
    ack(_topic: string, _messageId: string): Promise<void>;
    retry(_topic: string, _messageId: string): Promise<void>;
    deadLetter(_topic: string, _messageId: string): Promise<void>;
    getDepth(topic: string): Promise<number>;
    purge(topic: string): Promise<void>;
}
//# sourceMappingURL=memory-queue.d.ts.map