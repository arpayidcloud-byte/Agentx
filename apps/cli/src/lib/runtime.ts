import type { TaskModel } from '@agentx/core-runtime';
import type { ITaskRepository } from '@agentx/core-runtime';
import { Scheduler } from '@agentx/core-runtime';
import { InMemoryEventBus } from '@agentx/core-runtime';

class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, TaskModel>();

  async save(task: TaskModel): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findById(id: string): Promise<TaskModel | undefined> {
    return this.tasks.get(id);
  }

  async findByRootId(rootId: string): Promise<TaskModel[]> {
    return Array.from(this.tasks.values()).filter((t) => t.rootTaskId === rootId);
  }

  getAll(): TaskModel[] {
    return Array.from(this.tasks.values());
  }
}

let schedulerInstance: Scheduler | null = null;
let taskRepoInstance: InMemoryTaskRepository | null = null;

export function getRuntime() {
  if (!schedulerInstance || !taskRepoInstance) {
    const eventBus = new InMemoryEventBus();
    taskRepoInstance = new InMemoryTaskRepository();
    schedulerInstance = new Scheduler(eventBus, taskRepoInstance);
  }

  return {
    scheduler: schedulerInstance,
    taskRepo: taskRepoInstance,
  };
}

export function resetRuntime(): void {
  schedulerInstance = null;
  taskRepoInstance = null;
}
