import { EventBusError } from '../errors.js';
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { AgentXLoggerFactory } from '@agentx/shared';
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
export class InMemoryEventBus {
    handlers = new Map();
    processedEventIds = new Set();
    logger = new AgentXLoggerFactory().createLogger('core-runtime:event-bus');
    /**
     * Publishes an event to a topic.
     * @param topic - Event topic to publish to
     * @param payload - Event payload data
     * @param traceId - Trace ID for distributed tracing
     * @param taskId - Optional task ID associated with the event
     * @param metadata - Optional metadata for the event
     */
    async publish(topic, payload, traceId, taskId, metadata) {
        const event = {
            id: Math.random().toString(36).substring(2) + Date.now().toString(36),
            topic,
            traceId,
            taskId,
            timestamp: new Date(),
            version: '1.0',
            sourceModule: 'core-runtime',
            payload,
            metadata,
        };
        await this.dispatch(topic, event);
    }
    /**
     * Subscribes a handler to a topic.
     * @param topic - Topic to subscribe to
     * @param handler - Async handler function to process events
     */
    async subscribe(topic, handler) {
        if (!this.handlers.has(topic)) {
            this.handlers.set(topic, new Set());
        }
        this.handlers.get(topic).add(handler);
    }
    /**
     * Unsubscribes all handlers from a topic.
     * @param topic - Topic to unsubscribe from
     */
    async unsubscribe(topic) {
        this.handlers.delete(topic);
    }
    /**
     * Sends a request and waits for a reply.
     * @param topic - Request topic
     * @param payload - Request payload
     * @param traceId - Trace ID for distributed tracing
     * @param timeoutMs - Timeout in milliseconds (default: 5000)
     * @returns Promise resolving to the reply event envelope
     * @throws EventBusError if request times out
     */
    async request(topic, payload, traceId, timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            const replyTopic = `${topic}.reply.${Math.random().toString(36).substring(2)}`;
            const timeout = setTimeout(() => reject(new EventBusError(`Request timed out for topic ${topic}`)), timeoutMs);
            void this.subscribe(replyTopic, async (event) => {
                clearTimeout(timeout);
                await this.unsubscribe(replyTopic);
                resolve(event);
            });
            this.publish(topic, payload, traceId, undefined, { replyTo: replyTopic }).catch(reject);
        });
    }
    /**
     * Registers a handler that replies to requests on a topic.
     * @param topic - Request topic to handle
     * @param handler - Async handler that processes requests and returns responses
     */
    async reply(topic, handler) {
        await this.subscribe(topic, async (event) => {
            try {
                const responsePayload = await handler(event);
                const replyTo = event.metadata?.replyTo;
                if (replyTo) {
                    await this.publish(replyTo, responsePayload, event.traceId, event.taskId);
                }
            }
            catch (e) {
                this.logger.error('Error handling reply', e instanceof Error ? e : new Error(String(e)));
            }
        });
    }
    /**
     * Broadcasts an event to all subscribers of a topic.
     * @param topic - Topic to broadcast to
     * @param payload - Event payload
     * @param traceId - Trace ID for distributed tracing
     */
    async broadcast(topic, payload, traceId) {
        await this.publish(topic, payload, traceId);
    }
    async dispatch(topic, event) {
        if (this.processedEventIds.has(event.id)) {
            return; // Deduplicate
        }
        this.processedEventIds.add(event.id);
        const topicHandlers = this.handlers.get(topic);
        if (topicHandlers) {
            for (const handler of topicHandlers) {
                try {
                    const promise = handler(event);
                    if (promise && typeof promise.catch === 'function') {
                        promise.catch((err) => {
                            this.logger.error(`Error in event handler for topic ${topic}`, err instanceof Error ? err : new Error(String(err)));
                        });
                    }
                }
                catch (err) {
                    this.logger.error(`Error in event handler for topic ${topic}`, err instanceof Error ? err : new Error(String(err)));
                }
            }
        }
    }
}
export class BullMQEventBus {
    redisConnection;
    queues = new Map();
    workers = new Map();
    processedEventIds = new Set();
    logger = new AgentXLoggerFactory().createLogger('core-runtime:event-bus');
    constructor(redisUrl = 'redis://localhost:6379') {
        this.redisConnection = new Redis(redisUrl, {
            maxRetriesPerRequest: null,
        });
    }
    async publish(topic, payload, traceId, taskId, metadata) {
        if (!this.queues.has(topic)) {
            this.queues.set(topic, new Queue(topic, {
                connection: this.redisConnection,
            }));
        }
        const queue = this.queues.get(topic);
        const event = {
            id: Math.random().toString(36).substring(2) + Date.now().toString(36),
            topic,
            traceId,
            taskId,
            timestamp: new Date(),
            version: '1.0',
            sourceModule: 'core-runtime',
            payload,
            metadata,
        };
        await queue.add(topic, event, { jobId: event.id });
    }
    async subscribe(topic, handler) {
        if (this.workers.has(topic)) {
            throw new EventBusError(`Already subscribed to topic ${topic}`);
        }
        const worker = new Worker(topic, async (job) => {
            const event = job.data;
            if (this.processedEventIds.has(event.id)) {
                return; // Deduplicate
            }
            this.processedEventIds.add(event.id);
            await handler(event);
        }, { connection: this.redisConnection });
        this.workers.set(topic, worker);
    }
    async unsubscribe(topic) {
        const worker = this.workers.get(topic);
        if (worker) {
            await worker.close();
            this.workers.delete(topic);
        }
    }
    async request(topic, payload, traceId, timeoutMs = 5000) {
        const replyTopic = `${topic}.reply.${Math.random().toString(36).substring(2)}`;
        return new Promise((resolve, reject) => {
            void (async () => {
                const timeout = setTimeout(() => {
                    void (async () => {
                        await this.unsubscribe(replyTopic);
                        reject(new EventBusError(`Request timed out for topic ${topic}`));
                    })();
                }, timeoutMs);
                try {
                    await this.subscribe(replyTopic, async (event) => {
                        clearTimeout(timeout);
                        await this.unsubscribe(replyTopic);
                        resolve(event);
                    });
                    await this.publish(topic, payload, traceId, undefined, { replyTo: replyTopic });
                }
                catch (err) {
                    reject(err);
                }
            })();
        });
    }
    async reply(topic, handler) {
        await this.subscribe(topic, async (event) => {
            try {
                const responsePayload = await handler(event);
                const replyTo = event.metadata?.replyTo;
                if (replyTo) {
                    await this.publish(replyTo, responsePayload, event.traceId, event.taskId);
                }
            }
            catch (e) {
                this.logger.error('Error handling reply', e instanceof Error ? e : new Error(String(e)));
            }
        });
    }
    async broadcast(topic, payload, traceId) {
        await this.publish(topic, payload, traceId);
    }
    async close() {
        for (const queue of this.queues.values()) {
            await queue.close();
        }
        for (const worker of this.workers.values()) {
            await worker.close();
        }
        await this.redisConnection.quit();
    }
}
//# sourceMappingURL=index.js.map