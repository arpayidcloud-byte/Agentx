export class BaseSubAgent {
    id;
    role;
    providerId;
    promptTemplate;
    constructor(id, role, config) {
        this.id = id;
        this.role = role;
        this.providerId = config?.providerId;
        this.promptTemplate = config?.promptTemplate;
    }
    buildPrompt(task) {
        if (this.promptTemplate) {
            return this.promptTemplate
                .replace('{{goal}}', task.goal)
                .replace('{{taskId}}', task.id)
                .replace('{{role}}', this.role);
        }
        return `Execute task ${task.id}: ${task.goal} as ${this.role}`;
    }
    async execute(task, _context) {
        const prompt = this.buildPrompt(task);
        return {
            agentId: this.id,
            role: this.role,
            taskId: task.id,
            providerId: this.providerId,
            prompt,
            status: 'success',
            output: `Executed ${task.goal} successfully as ${this.role}`,
        };
    }
}
export class PlannerAgent extends BaseSubAgent {
    constructor(id, config) {
        super(id, 'planner', config);
    }
}
export class ArchitectAgent extends BaseSubAgent {
    constructor(id, config) {
        super(id, 'architect', config);
    }
}
export class CoderAgent extends BaseSubAgent {
    constructor(id, config) {
        super(id, 'coder', config);
    }
}
export class ReviewerAgent extends BaseSubAgent {
    constructor(id, config) {
        super(id, 'reviewer', config);
    }
}
export class TesterAgent extends BaseSubAgent {
    constructor(id, config) {
        super(id, 'tester', config);
    }
}
export class SecurityAgent extends BaseSubAgent {
    constructor(id, config) {
        super(id, 'security', config);
    }
}
// DocumentationAgent, PlannerAgent, ArchitectAgent, QAAgent have been moved
// to ./extended-agents.ts (beyond v0.1 core roster per RFC-0043).
//# sourceMappingURL=sub-agent.js.map