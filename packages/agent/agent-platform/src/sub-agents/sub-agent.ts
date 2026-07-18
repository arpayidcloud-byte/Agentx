import { SubAgent, AgentRole } from './interfaces.js';
import { TaskModel } from '@agentx/core-runtime';

export class BaseSubAgent implements SubAgent {
  public readonly id: string;
  public readonly role: AgentRole;

  constructor(id: string, role: AgentRole) {
    this.id = id;
    this.role = role;
  }

  public async execute(task: TaskModel, _context: unknown): Promise<unknown> {
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
  constructor(id: string) {
    super(id, 'planner');
  }
}

export class ArchitectAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'architect');
  }
}

export class CoderAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'coder');
  }
}

export class ReviewerAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'reviewer');
  }
}

export class TesterAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'tester');
  }
}

export class SecurityAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'security');
  }
}

export class DocumentationAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'documentation');
  }
}

export class QAAgent extends BaseSubAgent {
  constructor(id: string) {
    super(id, 'qa');
  }
}
