export class MemoryEngine {
    memoryStore;
    eventBus;
    metrics = {
        totalMemories: 0,
        averageImportance: 0,
        compactCount: 0,
        expiredCount: 0,
    };
    lruCache = new Map();
    lruHead = null;
    lruTail = null;
    maxCacheSize;
    constructor(memoryStore, eventBus, maxCacheSize = 100) {
        this.memoryStore = memoryStore;
        this.eventBus = eventBus;
        this.maxCacheSize = maxCacheSize;
    }
    async store(data) {
        const now = new Date();
        const memory = {
            id: `mem_${Math.random().toString(36).substring(2, 9)}`,
            type: data.type || 'working',
            content: data.content || '',
            importance: data.importance || 1,
            ttl: data.ttl,
            createdAt: now,
            metadata: data.metadata || {},
        };
        if (memory.ttl) {
            memory.expiresAt = new Date(now.getTime() + memory.ttl * 1000);
        }
        await this.memoryStore.save(memory);
        this.addToLRUCache(memory);
        void this.updateMetrics();
        await this.eventBus.publish('memory.created', memory, `trace_${memory.id}`);
        return memory;
    }
    async retrieve(query, options) {
        await this.cleanupExpired();
        if (query && options?.type) {
            const cached = Array.from(this.lruCache.values())
                .map((node) => node.value)
                .filter((m) => m.type === options.type && m.content.includes(query));
            if (cached.length > 0) {
                return cached.slice(0, options.limit || cached.length);
            }
        }
        return this.memoryStore.search(query, options);
    }
    async forget(memoryId) {
        const mem = await this.memoryStore.find(memoryId);
        if (!mem)
            return;
        await this.memoryStore.delete(memoryId);
        this.removeFromLRUCache(memoryId);
        void this.updateMetrics();
        await this.eventBus.publish('memory.deleted', { id: memoryId }, `trace_${memoryId}`);
    }
    async compact() {
        this.metrics.compactCount++;
        await this.cleanupExpired();
        const all = await this.memoryStore.list();
        for (const mem of all) {
            if (mem.importance <= 2 && mem.type === 'working') {
                await this.memoryStore.delete(mem.id);
                this.removeFromLRUCache(mem.id);
            }
        }
        void this.updateMetrics();
    }
    getMetrics() {
        return { ...this.metrics };
    }
    async getShortTermMemories(limit) {
        const memories = Array.from(this.lruCache.values())
            .map((node) => node.value)
            .slice(0, limit || this.maxCacheSize);
        return memories;
    }
    async getLongTermMemories(minImportance = 7, limit) {
        return this.memoryStore.search('', { minImportance, limit });
    }
    async retrieveByType(type, limit) {
        const cached = Array.from(this.lruCache.values())
            .map((node) => node.value)
            .filter((m) => m.type === type);
        if (cached.length > 0) {
            return cached.slice(0, limit || cached.length);
        }
        return this.memoryStore.search('', { type, limit });
    }
    addToLRUCache(memory) {
        if (this.lruCache.has(memory.id)) {
            this.removeLRUNode(this.lruCache.get(memory.id));
        }
        const node = {
            key: memory.id,
            value: memory,
            previous: null,
            next: this.lruHead,
        };
        if (this.lruHead) {
            this.lruHead.previous = node;
        }
        this.lruHead = node;
        if (!this.lruTail) {
            this.lruTail = node;
        }
        this.lruCache.set(memory.id, node);
        while (this.lruCache.size > this.maxCacheSize && this.lruTail) {
            this.removeLRUNode(this.lruTail);
        }
    }
    removeLRUNode(node) {
        if (node.previous) {
            node.previous.next = node.next;
        }
        else {
            this.lruHead = node.next;
        }
        if (node.next) {
            node.next.previous = node.previous;
        }
        else {
            this.lruTail = node.previous;
        }
        this.lruCache.delete(node.key);
    }
    removeFromLRUCache(memoryId) {
        const node = this.lruCache.get(memoryId);
        if (node) {
            this.removeLRUNode(node);
        }
    }
    async cleanupExpired() {
        const all = await this.memoryStore.list();
        const now = new Date();
        for (const mem of all) {
            if (mem.expiresAt && mem.expiresAt < now) {
                await this.memoryStore.delete(mem.id);
                this.removeFromLRUCache(mem.id);
                this.metrics.expiredCount++;
                await this.eventBus.publish('memory.expired', { id: mem.id }, `trace_${mem.id}`);
            }
        }
        void this.updateMetrics();
    }
    async updateMetrics() {
        const all = await this.memoryStore.list();
        this.metrics.totalMemories = all.length;
        let totalImp = 0;
        for (const m of all) {
            totalImp += m.importance;
        }
        this.metrics.averageImportance = all.length > 0 ? totalImp / all.length : 0;
    }
}
export class InMemoryStore {
    memories = new Map();
    async save(memory) {
        this.memories.set(memory.id, memory);
    }
    async find(id) {
        return this.memories.get(id);
    }
    async search(query, options) {
        let results = Array.from(this.memories.values());
        // Simple mock search
        if (query) {
            results = results.filter((m) => m.content.includes(query));
        }
        if (options?.type) {
            results = results.filter((m) => m.type === options.type);
        }
        const minImportance = options?.minImportance;
        if (minImportance) {
            results = results.filter((m) => m.importance >= minImportance);
        }
        if (options?.limit) {
            results = results.slice(0, options.limit);
        }
        return results;
    }
    async delete(id) {
        this.memories.delete(id);
    }
    async list() {
        return Array.from(this.memories.values());
    }
}
export * from './prisma-store.js';
//# sourceMappingURL=engine.js.map