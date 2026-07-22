import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
export class BullMQProvider {
    queues = new Map();
    redis;
    total = 0;
    successes = 0;
    failures = 0;
    constructor(redisUrl = 'redis://localhost:6379') {
        this.redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
    }
    getMetadata() {
        return {
            id: 'bullmq-queue',
            name: 'BullMQ Queue Provider',
            type: 'queue',
            version: '1.0.0',
        };
    }
    getCapabilities() {
        return { priorityQueue: true };
    }
    async healthCheck() {
        try {
            await this.redis.ping();
            return { healthy: true, latencyMs: 1, lastChecked: new Date(), status: 'ACTIVE' };
        }
        catch (e) {
            return {
                healthy: false,
                latencyMs: 0,
                lastChecked: new Date(),
                status: 'DEGRADED',
                details: { error: String(e) },
            };
        }
    }
    getMetrics() {
        return {
            totalRequests: this.total,
            successfulRequests: this.successes,
            failedRequests: this.failures,
            averageLatencyMs: 0,
        };
    }
    getQueue(topic) {
        let q = this.queues.get(topic);
        if (!q) {
            // @ts-expect-error - bullmq redis connection type mismatch
            q = new Queue(topic, { connection: this.redis });
            this.queues.set(topic, q);
        }
        return q;
    }
    async enqueue(topic, message, priority = 0) {
        this.total++;
        try {
            const q = this.getQueue(topic);
            const bullPriority = Math.max(1, 100 - priority);
            await q.add('job', message, {
                priority: bullPriority,
                jobId: `msg-${Date.now()}-${Math.random()}`,
            });
            this.successes++;
        }
        catch (e) {
            this.failures++;
            throw e;
        }
    }
    async dequeue(_topic) {
        throw new Error('dequeue() not natively supported by BullMQ push model. Use Workers.');
    }
    async peek(topic) {
        const q = this.getQueue(topic);
        const jobs = await q.getWaiting(0, 0);
        return jobs.length > 0 ? jobs[0]?.data : undefined;
    }
    async ack(_topic, _messageId) {
        // Ack happens automatically in BullMQ worker
    }
    async retry(topic, messageId) {
        const q = this.getQueue(topic);
        const job = await q.getJob(messageId);
        if (job)
            await job.retry();
    }
    async deadLetter(_topic, _messageId) {
        // Configured via removeOnFail options in BullMQ
    }
    async getDepth(topic) {
        const q = this.getQueue(topic);
        return await q.getWaitingCount();
    }
    async purge(topic) {
        const q = this.getQueue(topic);
        await q.obliterate();
    }
}
//# sourceMappingURL=bullmq-queue.js.map