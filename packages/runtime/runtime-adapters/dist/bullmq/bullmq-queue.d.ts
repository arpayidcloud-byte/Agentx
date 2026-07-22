import type { IQueueProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class BullMQProvider implements IQueueProvider {
    private queues;
    private redis;
    private total;
    private successes;
    private failures;
    constructor(redisUrl?: string);
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    private getQueue;
    enqueue(topic: string, message: unknown, priority?: number): Promise<void>;
    dequeue(_topic: string): Promise<unknown>;
    peek(topic: string): Promise<unknown>;
    ack(_topic: string, _messageId: string): Promise<void>;
    retry(topic: string, messageId: string): Promise<void>;
    deadLetter(_topic: string, _messageId: string): Promise<void>;
    getDepth(topic: string): Promise<number>;
    purge(topic: string): Promise<void>;
}
//# sourceMappingURL=bullmq-queue.d.ts.map