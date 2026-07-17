import { AgentRole } from './interfaces.js';
import { TaskModel } from '@agentx/core-runtime';
import { AgentPool } from './agent-pool.js';
import { MessageBus } from './message-bus.js';
export interface ParallelExecutionResult {
    taskId: string;
    results: Record<string, unknown>;
    errors: Record<string, Error>;
}
export declare class ParallelRunner {
    private pool;
    private bus;
    constructor(pool: AgentPool, bus: MessageBus);
    runParallel(task: TaskModel, roles: AgentRole[], context: unknown): Promise<ParallelExecutionResult>;
    private runSingleAgent;
}
//# sourceMappingURL=parallel-runner.d.ts.map