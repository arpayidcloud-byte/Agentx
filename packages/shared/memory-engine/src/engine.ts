import {
  IMemoryEngine,
  IMemoryStore,
  Memory,
  MemorySearchOptions,
  MemoryMetrics,
} from './interfaces.js';
import { IEventBus } from '@agentx/core-runtime';

export class MemoryEngine implements IMemoryEngine {
  private metrics: MemoryMetrics = {
    totalMemories: 0,
    averageImportance: 0,
    compactCount: 0,
    expiredCount: 0,
  };

  constructor(
    private memoryStore: IMemoryStore,
    private eventBus: IEventBus,
  ) {}

  public async store(data: Partial<Memory>): Promise<Memory> {
    const now = new Date();
    const memory: Memory = {
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
    this.updateMetrics();

    await this.eventBus.publish('memory.created', memory, `trace_${memory.id}`);
    return memory;
  }

  public async retrieve(query: string, options?: MemorySearchOptions): Promise<Memory[]> {
    await this.cleanupExpired();
    return this.memoryStore.search(query, options);
  }

  public async forget(memoryId: string): Promise<void> {
    const mem = await this.memoryStore.find(memoryId);
    if (!mem) return;

    await this.memoryStore.delete(memoryId);
    this.updateMetrics();
    await this.eventBus.publish('memory.deleted', { id: memoryId }, `trace_${memoryId}`);
  }

  public async compact(): Promise<void> {
    this.metrics.compactCount++;
    await this.cleanupExpired();
    // Simulate further compaction logic by deleting low importance memories if needed
    // Simple implementation for foundation
    const all = await this.memoryStore.list();
    for (const mem of all) {
      if (mem.importance <= 2 && mem.type === 'working') {
        await this.memoryStore.delete(mem.id);
      }
    }
    this.updateMetrics();
  }

  public getMetrics(): MemoryMetrics {
    return { ...this.metrics };
  }

  private async cleanupExpired(): Promise<void> {
    const all = await this.memoryStore.list();
    const now = new Date();
    for (const mem of all) {
      if (mem.expiresAt && mem.expiresAt < now) {
        await this.memoryStore.delete(mem.id);
        this.metrics.expiredCount++;
        await this.eventBus.publish('memory.expired', { id: mem.id }, `trace_${mem.id}`);
      }
    }
    this.updateMetrics();
  }

  private async updateMetrics(): Promise<void> {
    const all = await this.memoryStore.list();
    this.metrics.totalMemories = all.length;
    let totalImp = 0;
    for (const m of all) {
      totalImp += m.importance;
    }
    this.metrics.averageImportance = all.length > 0 ? totalImp / all.length : 0;
  }
}

export class InMemoryStore implements IMemoryStore {
  private memories = new Map<string, Memory>();

  async save(memory: Memory): Promise<void> {
    this.memories.set(memory.id, memory);
  }

  async find(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async search(query: string, options?: MemorySearchOptions): Promise<Memory[]> {
    let results = Array.from(this.memories.values());

    // Simple mock search
    if (query) {
      results = results.filter((m) => m.content.includes(query));
    }
    if (options?.type) {
      results = results.filter((m) => m.type === options.type);
    }
    if (options?.minImportance) {
      results = results.filter((m) => m.importance >= options.minImportance!);
    }
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async delete(id: string): Promise<void> {
    this.memories.delete(id);
  }

  async list(): Promise<Memory[]> {
    return Array.from(this.memories.values());
  }
}
