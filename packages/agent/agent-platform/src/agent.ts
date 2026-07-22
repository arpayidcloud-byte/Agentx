// packages/agent/agent-platform/src/agent.ts
import type { TaskModel, TaskContext } from '@agentx/core-runtime';
import { BaseAgent } from './base-agent.js';

export type AgentRole = 'coding' | 'review' | 'test' | 'security';

export interface AgentDefinition {
  role: AgentRole;
  allowedToolCategories: string[];
  systemPromptTemplateId: string;
}

export interface AgentResult {
  success: boolean;
  output: string;
  toolCalls?: Array<{ tool: string; args: Record<string, unknown> }>;
  usage?: { inputTokens: number; outputTokens: number; costUsd: number };
}

export interface Agent {
  readonly role: AgentRole;
  run(task: TaskModel, context: TaskContext): Promise<AgentResult>;
}

// Specialized agent implementations that extend BaseAgent
export class CodingAgent extends BaseAgent implements Agent {
  readonly role: AgentRole = 'coding';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are an expert software engineer. Implement the following task:

Task: ${task.input}

Provide clean, production-ready code with proper error handling.`;

      const output = await this.callProvider(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class ReviewAgent extends BaseAgent implements Agent {
  readonly role: AgentRole = 'review';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are a senior code reviewer. Review the following code:

${task.input}

Check for:
- Code quality and best practices
- Potential bugs
- Security issues
- Performance concerns
- Maintainability

Provide specific, actionable feedback.`;

      const output = await this.callProvider(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class TestAgent extends BaseAgent implements Agent {
  readonly role: AgentRole = 'test';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are an expert test engineer. Generate comprehensive tests for:

${task.input}

Include:
- Unit tests
- Edge cases
- Error handling
- Integration tests where appropriate

Use appropriate testing frameworks and best practices.`;

      const output = await this.callProvider(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class SecurityAgent extends BaseAgent implements Agent {
  readonly role: AgentRole = 'security';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are a security expert. Analyze the following code for vulnerabilities:

${task.input}

Check for:
- Injection attacks (SQL, XSS, command injection)
- Authentication/authorization issues
- Data exposure and privacy concerns
- Insecure dependencies
- Security misconfigurations

List vulnerabilities by severity (Critical, High, Medium, Low).`;

      const output = await this.callProvider(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}