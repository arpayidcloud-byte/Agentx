import type { ResourceAllocation } from './interfaces.js';
import type { TaskModel } from '@agentx/core-runtime';
export interface TaskGraphNode {
    task: TaskModel;
    estimatedBudget: ResourceAllocation;
}
export declare class TaskSplitter {
    decomposeTask(_goal: string, _context: unknown, _globalBudget: ResourceAllocation): TaskGraphNode[];
    private createStubNode;
}
export declare class DependencyAnalyzer {
    validateGraph(nodes: TaskGraphNode[]): void;
}
//# sourceMappingURL=task-splitter.d.ts.map