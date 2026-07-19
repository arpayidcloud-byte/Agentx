import type { SubAgent, AgentRole, AgentConfig } from './interfaces.js';
import type { TaskModel } from '@agentx/core-runtime';
export declare class BaseSubAgent implements SubAgent {
    readonly id: string;
    readonly role: AgentRole;
    protected readonly providerId?: string;
    protected readonly promptTemplate?: string;
    constructor(id: string, role: AgentRole, config?: AgentConfig);
    buildPrompt(task: TaskModel): string;
    execute(task: TaskModel, _context: unknown): Promise<unknown>;
}
export declare class PlannerAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig);
}
export declare class ArchitectAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig);
}
export declare class CoderAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig);
}
export declare class ReviewerAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig);
}
export declare class TesterAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig);
}
export declare class SecurityAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig);
}
//# sourceMappingURL=sub-agent.d.ts.map