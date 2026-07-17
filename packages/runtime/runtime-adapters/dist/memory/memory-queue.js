/**
 * @module runtime-adapters/memory/memory-queue
 * @description Reference in-memory queue provider.
 */
export class MemoryQueueProvider {
    queue = new Map();
    total = 0;
    successes = 0;
    failures = 0;
    getMetadata() {
        return {
            id: 'memory-queue',
            name: 'Memory Queue Provider',
            type: 'queue',
            version: '0.1.0',
        };
    }
    getCapabilities() {
        return { priorityQueue: true };
    }
    async healthCheck() {
        return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
    }
    getMetrics() {
        return { totalRequests: this.total, successfulRequests: this.successes, failedRequests: this.failures, averageLatencyMs: 0 };
    }
    async enqueue(topic, message, priority = 0) {
        this.total++;
        const msgs = this.queue.get(topic) || [];
        msgs.push({ id: `msg-${Date.now()}-${Math.random()}`, payload: message, priority });
        msgs.sort((a, b) => b.priority - a.priority);
        this.queue.set(topic, msgs);
        this.successes++;
    }
    async dequeue(topic) {
        const msgs = this.queue.get(topic) || [];
        const val = msgs.shift();
        this.queue.set(topic, msgs);
        return val?.payload;
    }
    async peek(topic) {
        const msgs = this.queue.get(topic) || [];
        return msgs[0]?.payload;
    }
    async ack(_topic, _messageId) {
        // Memory queue pops immediately on dequeue, no-op for now.
    }
    async retry(_topic, _messageId) {
        // Memory queue retry logic
    }
    async deadLetter(_topic, _messageId) {
        // Memory queue dead-letter
    }
    async getDepth(topic) {
        return (this.queue.get(topic) || []).length;
    }
    async purge(topic) {
        this.queue.delete(topic);
    }
}
//# sourceMappingURL=memory-queue.js.map