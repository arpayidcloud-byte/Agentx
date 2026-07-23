import type { IMemoryEngine, IMemoryStore, Memory, MemorySearchOptions, MemoryMetrics, MemoryType } from './interfaces.js';
import type { IEventBus } from '@agentx/core-runtime';
export declare class MemoryEngine implements IMemoryEngine {
    private memoryStore;
    private eventBus;
    private metrics;
    private lruCache;
    private lruHead;
    private lruTail;
    private readonly maxCacheSize;
    constructor(memoryStore: IMemoryStore, eventBus: IEventBus, maxCacheSize?: number);
    store(data: Partial<Memory>): Promise<Memory>;
    retrieve(query: string, options?: MemorySearchOptions): Promise<Memory[]>;
    forget(memoryId: string): Promise<void>;
    compact(): Promise<void>;
    getMetrics(): MemoryMetrics;
    getShortTermMemories(limit?: number): Promise<Memory[]>;
    getLongTermMemories(minImportance?: number, limit?: number): Promise<Memory[]>;
    retrieveByType(type: MemoryType, limit?: number): Promise<Memory[]>;
    retrieveByRecency(limit?: number): Promise<Memory[]>;
    retrieveByImportance(minImportance?: number, limit?: number): Promise<Memory[]>;
    retrieveByRelevance(query: string, limit?: number): Promise<Memory[]>;
    retrieveBySession(sessionId: string, limit?: number): Promise<Memory[]>;
    retrieveByTask(taskId: string, limit?: number): Promise<Memory[]>;
    private addToLRUCache;
    private removeLRUNode;
    private removeFromLRUCache;
    private cleanupExpired;
    private updateMetrics;
}
export declare class InMemoryStore implements IMemoryStore {
    private memories;
    save(memory: Memory): Promise<void>;
    find(id: string): Promise<Memory | undefined>;
    search(query: string, options?: MemorySearchOptions): Promise<Memory[]>;
    delete(id: string): Promise<void>;
    list(): Promise<Memory[]>;
}
export * from './prisma-store.js';
//# sourceMappingURL=engine.d.ts.map