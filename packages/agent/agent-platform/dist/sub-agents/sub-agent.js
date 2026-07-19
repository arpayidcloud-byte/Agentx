export class BaseSubAgent {
    id;
    role;
    constructor(id, role) {
        this.id = id;
        this.role = role;
    }
    async execute(task, _context) {
        // Implements single responsibility, delegating work to provider completions.
        // Stub implementation for foundation package, returned dummy result.
        return {
            agentId: this.id,
            role: this.role,
            taskId: task.id,
            status: 'success',
            output: `Executed ${task.goal} successfully as ${this.role}`,
        };
    }
}
export class PlannerAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'planner');
    }
}
export class ArchitectAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'architect');
    }
}
export class CoderAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'coder');
    }
}
export class ReviewerAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'reviewer');
    }
}
export class TesterAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'tester');
    }
}
export class SecurityAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'security');
    }
}
export class DocumentationAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'documentation');
    }
}
export class QAAgent extends BaseSubAgent {
    constructor(id) {
        super(id, 'qa');
    }
}
//# sourceMappingURL=sub-agent.js.map