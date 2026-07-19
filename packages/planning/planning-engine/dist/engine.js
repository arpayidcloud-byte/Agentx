export class PlanningEngine {
    eventBus;
    metrics = {
        totalPlansCreated: 0,
        totalPlansOptimized: 0,
        averageTasksPerPlan: 0,
        averageRiskScore: 0,
    };
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async createPlan(goal, context) {
        // Simple deterministic decomposition for foundation
        const tasks = [
            {
                id: `t_${Math.random().toString(36).substring(2, 9)}`,
                description: `Analyze: ${goal}`,
                assignedAgent: 'planner',
                requiredTools: ['fs.read'],
                estimatedDurationMs: 1000,
            },
            {
                id: `t_${Math.random().toString(36).substring(2, 9)}`,
                description: `Execute: ${goal}`,
                assignedAgent: 'coder',
                requiredTools: ['fs.read', 'fs.write'],
                estimatedDurationMs: 5000,
            },
        ];
        const plan = {
            id: `plan_${Math.random().toString(36).substring(2, 9)}`,
            goal,
            tasks,
            dependencies: [
                { source: tasks[0].id, target: tasks[1].id },
            ],
            estimatedCostUsd: 0.05,
            estimatedTokens: 1000,
            riskScore: 40, // Base risk due to fs.write
            createdAt: new Date(),
            metadata: context,
        };
        this.updateMetrics(plan, true);
        await this.eventBus.publish('plan.created', plan, `trace_${plan.id}`);
        return plan;
    }
    async optimizePlan(plan) {
        // Simulated optimization: merges tasks or reduces dependencies
        const optimized = {
            ...plan,
            estimatedCostUsd: plan.estimatedCostUsd * 0.9,
            estimatedTokens: Math.floor(plan.estimatedTokens * 0.9),
            metadata: { ...plan.metadata, optimized: true },
        };
        this.metrics.totalPlansOptimized++;
        await this.eventBus.publish('plan.optimized', optimized, `trace_${optimized.id}`);
        return optimized;
    }
    async validatePlan(plan) {
        const errors = [];
        const warnings = [];
        if (!plan.goal)
            errors.push('Goal is required');
        if (plan.tasks.length === 0)
            errors.push('Plan must have at least one task');
        if (plan.riskScore >= 90) {
            warnings.push('High risk score, requires double confirmation');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    explainPlan(plan) {
        let explanation = `Plan for: ${plan.goal}\n`;
        explanation += `Tasks: ${plan.tasks.length}\n`;
        explanation += `Estimated Cost: $${plan.estimatedCostUsd}\n\n`;
        for (const task of plan.tasks) {
            explanation += `- [${task.assignedAgent}] ${task.description}\n`;
        }
        return explanation;
    }
    getMetrics() {
        return { ...this.metrics };
    }
    updateMetrics(plan, isNew) {
        if (isNew) {
            const prevTotal = this.metrics.totalPlansCreated;
            this.metrics.totalPlansCreated++;
            this.metrics.averageTasksPerPlan =
                (this.metrics.averageTasksPerPlan * prevTotal + plan.tasks.length) /
                    this.metrics.totalPlansCreated;
            this.metrics.averageRiskScore =
                (this.metrics.averageRiskScore * prevTotal + plan.riskScore) /
                    this.metrics.totalPlansCreated;
        }
    }
}
//# sourceMappingURL=engine.js.map