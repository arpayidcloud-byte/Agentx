import { IPlanningEngine, ExecutionPlan, ValidationResult, PlanMetrics } from './interfaces.js';
import { IEventBus } from '@agentx/core-runtime';
export declare class PlanningEngine implements IPlanningEngine {
    private eventBus;
    private metrics;
    constructor(eventBus: IEventBus);
    createPlan(goal: string, context: Record<string, unknown>): Promise<ExecutionPlan>;
    optimizePlan(plan: ExecutionPlan): Promise<ExecutionPlan>;
    validatePlan(plan: ExecutionPlan): Promise<ValidationResult>;
    explainPlan(plan: ExecutionPlan): string;
    getMetrics(): PlanMetrics;
    private updateMetrics;
}
//# sourceMappingURL=engine.d.ts.map