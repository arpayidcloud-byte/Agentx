import type { IEventBus, EventEnvelope } from '../interfaces/events.js';
/**
 * In-memory implementation of IEventBus for testing and development.
 * Provides pub/sub, request/reply, and broadcast patterns.
 * @example
 * ```ts
 * const bus = new InMemoryEventBus();
 * await bus.subscribe('task.created', handler);
 * await bus.publish('task.created', task, traceId);
 * ```
 */
export declare class InMemoryEventBus implements IEventBus {
    private handlers;
    private processedEventIds;
    private logger;
    /**
     * Publishes an event to a topic.
     * @param topic - Event topic to publish to
     * @param payload - Event payload data
     * @param traceId - Trace ID for distributed tracing
     * @param taskId - Optional task ID associated with the event
     * @param metadata - Optional metadata for the event
     */
    publish<T>(topic: string, payload: T, traceId: string, taskId?: string, metadata?: Record<string, unknown>): Promise<void>;
    /**
     * Subscribes a handler to a topic.
     * @param topic - Topic to subscribe to
     * @param handler - Async handler function to process events
     */
    subscribe<T>(topic: string, handler: (event: EventEnvelope<T>) => Promise<void>): Promise<void>;
    /**
     * Unsubscribes all handlers from a topic.
     * @param topic - Topic to unsubscribe from
     */
    unsubscribe(topic: string): Promise<void>;
    /**
     * Sends a request and waits for a reply.
     * @param topic - Request topic
     * @param payload - Request payload
     * @param traceId - Trace ID for distributed tracing
     * @param timeoutMs - Timeout in milliseconds (default: 5000)
     * @returns Promise resolving to the reply event envelope
     * @throws EventBusError if request times out
     */
    request<TReq, TRes>(topic: string, payload: TReq, traceId: string, timeoutMs?: number): Promise<EventEnvelope<TRes>>;
    /**
     * Registers a handler that replies to requests on a topic.
     * @param topic - Request topic to handle
     * @param handler - Async handler that processes requests and returns responses
     */
    reply<TReq, TRes>(topic: string, handler: (event: EventEnvelope<TReq>) => Promise<TRes>): Promise<void>;
    /**
     * Broadcasts an event to all subscribers of a topic.
     * @param topic - Topic to broadcast to
     * @param payload - Event payload
     * @param traceId - Trace ID for distributed tracing
     */
    broadcast<T>(topic: string, payload: T, traceId: string): Promise<void>;
    private dispatch;
}
export declare class BullMQEventBus implements IEventBus {
    private redisConnection;
    private queues;
    private workers;
    private processedEventIds;
    private logger;
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