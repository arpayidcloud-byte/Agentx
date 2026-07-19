import type { SubAgent, AgentRole, AgentConfig } from './interfaces.js';
import type { TaskModel } from '@agentx/core-runtime';

export class BaseSubAgent implements SubAgent {
  public readonly id: string;
  public readonly role: AgentRole;
  protected readonly providerId?: string;
  protected readonly promptTemplate?: string;

  constructor(id: string, role: AgentRole, config?: AgentConfig) {
    this.id = id;
    this.role = role;
    this.providerId = config?.providerId;
    this.promptTemplate = config?.promptTemplate;
  }

  public buildPrompt(task: TaskModel): string {
    if (this.promptTemplate) {
      return this.promptTemplate
        .replace('{{goal}}', task.goal)
        .replace('{{taskId}}', task.id)
        .replace('{{role}}', this.role);
    }
    return `Execute task ${task.id}: ${task.goal} as ${this.role}`;
  }

  public async execute(task: TaskModel, _context: unknown): Promise<unknown> {
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
  constructor(id: string, config?: AgentConfig) {
    super(id, 'planner', config);
  }
}

export class ArchitectAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'architect', config);
  }
}

export class CoderAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'coder', config);
  }
}

export class ReviewerAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'reviewer', config);
  }
}

export class TesterAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'tester', config);
  }
}

export class SecurityAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'security', config);
  }
}

export class DocumentationAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'documentation', config);
  }
}

export class QAAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'qa', config);
  }
}
