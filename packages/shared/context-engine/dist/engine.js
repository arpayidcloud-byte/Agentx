import { createHash } from 'crypto';
export class ContextEngine {
    eventBus;
    estimator;
    compressor;
    contexts = new Map();
    metrics = {
        totalContexts: 0,
        averageTokens: 0,
        compressionRatio: 1.0,
        mergeCount: 0
    };
    constructor(eventBus, estimator, compressor) {
        this.eventBus = eventBus;
        this.estimator = estimator;
        this.compressor = compressor;
    }
    computeChecksum(data) {
        return createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }
    async createContext(scope, initialData = {}) {
        const id = `ctx_${Math.random().toString(36).substring(2, 9)}`;
        const snapshot = {
            id,
            scope,
            version: 1,
            data: { ...initialData },
            checksum: this.computeChecksum(initialData),
            tokenEstimate: this.estimator.estimate(initialData),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.contexts.set(id, snapshot);
        this.updateMetrics();
        await this.eventBus.publish('context.created', snapshot, `trace_${id}`);
        return snapshot;
    }
    async updateContext(contextId, updates) {
        const existing = this.contexts.get(contextId);
        if (!existing)
            throw new Error(`Context ${contextId} not found`);
        const newData = { ...existing.data, ...updates };
        const snapshot = {
            ...existing,
            version: existing.version + 1,
            data: newData,
            checksum: this.computeChecksum(newData),
            tokenEstimate: this.estimator.estimate(newData),
            updatedAt: new Date()
        };
        this.contexts.set(contextId, snapshot);
        this.updateMetrics();
        await this.eventBus.publish('context.updated', snapshot, `trace_${contextId}`);
        return snapshot;
    }
    async getContext(contextId) {
        return this.contexts.get(contextId);
    }
    async mergeContexts(sourceIds, targetScope) {
        const mergedData = {};
        for (const id of sourceIds) {
            const ctx = this.contexts.get(id);
            if (ctx) {
                Object.assign(mergedData, ctx.data);
            }
        }
        this.metrics.mergeCount++;
        return this.createContext(targetScope, mergedData);
    }
    async compressContext(contextId, targetTokens) {
        const existing = this.contexts.get(contextId);
        if (!existing)
            throw new Error(`Context ${contextId} not found`);
        if (existing.tokenEstimate <= targetTokens)
            return existing;
        const ratio = targetTokens / existing.tokenEstimate;
        const compressedData = this.compressor.compress(existing.data, ratio);
        return this.updateContext(contextId, compressedData);
    }
    async validateContext(contextId) {
        const existing = this.contexts.get(contextId);
        if (!existing)
            return false;
        return existing.checksum === this.computeChecksum(existing.data);
    }
    updateMetrics() {
        this.metrics.totalContexts = this.contexts.size;
        let totalTokens = 0;
        for (const ctx of this.contexts.values()) {
            totalTokens += ctx.tokenEstimate;
        }
        this.metrics.averageTokens = this.contexts.size > 0 ? totalTokens / this.contexts.size : 0;
    }
    getMetrics() {
        return { ...this.metrics };
    }
}
//# sourceMappingURL=engine.js.map