import { ProductionRuntime } from '@agentx/runtime-production';
import { Scheduler, InMemoryEventBus } from '@agentx/core-runtime';
import { InMemoryTaskRepository } from '@agentx/runtime-adapters';
import type { ITaskRepository } from '@agentx/core-runtime';
import type { IEventBus } from '@agentx/core-runtime';

let _runtime: ProductionRuntime | null = null;
let _testRuntime: { scheduler: Scheduler; bus: IEventBus; taskRepo: ITaskRepository } | null = null;

const USE_TEST_RUNTIME = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

export function getRuntime(): {
  scheduler: Scheduler;
  bus: IEventBus;
  prisma?: unknown;
  taskRepo: ITaskRepository;
} {
  if (USE_TEST_RUNTIME) {
    if (!_testRuntime) {
      const taskRepo = new InMemoryTaskRepository();
      const bus = new InMemoryEventBus();
      const scheduler = new Scheduler(bus, taskRepo);
      _testRuntime = { scheduler, bus, taskRepo };
    }
    return _testRuntime;
  }

  if (!_runtime) {
    _runtime = new ProductionRuntime(process.env.REDIS_URL || 'redis://localhost:6379');
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
    _runtime = null;
  }
  if (_testRuntime) {
    _testRuntime = null;
  }
}
