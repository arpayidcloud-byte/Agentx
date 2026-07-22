import type { SubAgent, AgentRole, AgentConfig } from './interfaces.js';
import type { TaskModel } from '@agentx/core-runtime';
import type { CompletionResponse } from '@agentx/provider-sdk';
import { ProviderRegistry } from '@agentx/provider-sdk';
export declare class BaseSubAgent implements SubAgent {
    readonly id: string;
    readonly role: AgentRole;
    protected readonly providerId?: string;
    protected readonly promptTemplate?: string;
    protected readonly providerRegistry: ProviderRegistry;
    constructor(id: string, role: AgentRole, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
    protected callLLM(prompt: string, systemPrompt?: string, modelId?: string): Promise<CompletionResponse>;
    execute(task: TaskModel, _context: unknown): Promise<unknown>;
}
export declare class PlannerAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
}
export declare class ArchitectAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
}
export declare class CoderAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
}
export declare class ReviewerAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
}
export declare class TesterAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
}
export declare class SecurityAgent extends BaseSubAgent {
    constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry);
    buildPrompt(task: TaskModel): string;
}
//# sourceMappingURL=sub-agent.d.ts.map