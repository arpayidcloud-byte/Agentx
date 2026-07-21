// packages/agent/agent-platform/src/agent.ts
import type { TaskModel, TaskContext } from '@agentx/core-runtime';

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