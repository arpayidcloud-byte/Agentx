import type { IMemoryStore, Memory, MemorySearchOptions } from './interfaces.js';
import type { TaskModel, TaskStatus } from '@agentx/core-runtime';

export interface AuditEvent {
  id: string;
  taskId: string;
  action: string;
  payload: unknown;
  timestamp: Date;
}

export interface StoredTaskContext {
  taskId: string;
  variables: Record<string, unknown>;
  history: Array<{ role: string; content: unknown }>;
}

export class PrismaMemoryStore implements IMemoryStore {
  private memories = new Map<string, Memory>();
  private tasks = new Map<string, TaskModel>();
  private auditEvents = new Map<string, AuditEvent[]>();
  private taskContexts = new Map<string, StoredTaskContext>();

  async save(memory: Memory): Promise<void> {
    this.memories.set(memory.id, memory);
  }

  async find(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async search(query: string, options?: MemorySearchOptions): Promise<Memory[]> {
    let results = Array.from(this.memories.values());

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

  async delete(id: string): Promise<void> {
    this.memories.delete(id);
  }

  async list(): Promise<Memory[]> {
    return Array.from(this.memories.values());
  }

  async saveTask(task: TaskModel): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async loadTaskContext(taskId: string): Promise<StoredTaskContext | undefined> {
    return this.taskContexts.get(taskId);
  }

  async appendAuditEvent(taskId: string, event: AuditEvent): Promise<void> {
    const existing = this.auditEvents.get(taskId);
    if (existing) {
      existing.push(event);
    } else {
      this.auditEvents.set(taskId, [event]);
    }
  }

  async queryByStatus(status: TaskStatus): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter((t) => t.status === status);
  }
}
