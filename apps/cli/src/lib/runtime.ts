import { ProductionRuntime } from '@agentx/runtime-production';
import type { ITaskRepository, Scheduler } from '@agentx/core-runtime';
import type { IEventBus } from '@agentx/core-runtime';

let _runtime: ProductionRuntime | null = null;

export function getRuntime(): { scheduler: Scheduler; bus: IEventBus; prisma: unknown; taskRepo: ITaskRepository } {
  if (!_runtime) {
    _runtime = new ProductionRuntime(process.env.REDIS_URL || 'redis://localhost:6379');
    // Fire & forget start
    _runtime.start().catch(console.error);
  }
  return {
    scheduler: _runtime.scheduler,
    bus: _runtime.eventBus,
    prisma: _runtime.prisma,
    taskRepo: _runtime.taskRepo,
  };
}

export function resetRuntime(): void {
  if (_runtime) {
    _runtime.stop().catch(console.error);
  }
  _runtime = null;
}
