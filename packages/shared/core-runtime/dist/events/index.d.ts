import { IEventBus, EventEnvelope } from '../interfaces/events.js';
export declare class InMemoryEventBus implements IEventBus {
    private handlers;
    private processedEventIds;
    publish<T>(topic: string, payload: T, traceId: string, taskId?: string, metadata?: Record<string, unknown>): Promise<void>;
    subscribe<T>(topic: string, handler: (event: EventEnvelope<T>) => Promise<void>): Promise<void>;
    unsubscribe(topic: string): Promise<void>;
    request<TReq, TRes>(topic: string, payload: TReq, traceId: string, timeoutMs?: number): Promise<EventEnvelope<TRes>>;
    reply<TReq, TRes>(topic: string, handler: (event: EventEnvelope<TReq>) => Promise<TRes>): Promise<void>;
    broadcast<T>(topic: string, payload: T, traceId: string): Promise<void>;
    private dispatch;
}
export declare class BullMQEventBus implements IEventBus {
    private redisConnection;
    private queues;
    private workers;
    private processedEventIds;
    constructor(redisUrl?: string);
    publish<T>(topic: string, payload: T, traceId: string, taskId?: string, metadata?: Record<string, unknown>): Promise<void>;
    subscribe<T>(topic: string, handler: (event: EventEnvelope<T>) => Promise<void>): Promise<void>;
    unsubscribe(topic: string): Promise<void>;
    request<TReq, TRes>(topic: string, payload: TReq, traceId: string, timeoutMs?: number): Promise<EventEnvelope<TRes>>;
    reply<TReq, TRes>(topic: string, handler: (event: EventEnvelope<TReq>) => Promise<TRes>): Promise<void>;
    broadcast<T>(topic: string, payload: T, traceId: string): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map