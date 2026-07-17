import { IMemoryEngine, IMemoryStore, Memory, MemorySearchOptions, MemoryMetrics } from './interfaces.js';
import { IEventBus } from '@agentx/core-runtime';
export declare class MemoryEngine implements IMemoryEngine {
    private memoryStore;
    private eventBus;
    private metrics;
    constructor(memoryStore: IMemoryStore, eventBus: IEventBus);
    store(data: Partial<Memory>): Promise<Memory>;
    retrieve(query: string, options?: MemorySearchOptions): Promise<Memory[]>;
    forget(memoryId: string): Promise<void>;
    compact(): Promise<void>;
    getMetrics(): MemoryMetrics;
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
//# sourceMappingURL=engine.d.ts.map