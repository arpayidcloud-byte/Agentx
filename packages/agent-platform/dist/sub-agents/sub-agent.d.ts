import { SubAgent, AgentRole } from './interfaces.js';
import { TaskModel } from '@agentx/core-runtime';
export declare class BaseSubAgent implements SubAgent {
    readonly id: string;
    readonly role: AgentRole;
    constructor(id: string, role: AgentRole);
    execute(task: TaskModel, _context: unknown): Promise<unknown>;
}
export declare class PlannerAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class ArchitectAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class CoderAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class ReviewerAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class TesterAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class SecurityAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class DocumentationAgent extends BaseSubAgent {
    constructor(id: string);
}
export declare class QAAgent extends BaseSubAgent {
    constructor(id: string);
}
//# sourceMappingURL=sub-agent.d.ts.map