import type {
  IToolRegistry,
  ToolExecutionRequest,
  ToolExecutionContext,
} from '../interfaces/index.js';
import type { ToolExecutionPipeline } from '../interfaces/index.js';
import type {
  NormalizedToolSpec,
  NormalizedToolCall,
  ToolResult as ProviderToolResult,
  CompletionResponse,
} from '@agentx/provider-sdk';

export interface ToolOrchestratorConfig {
  maxIterations: number;
  timeoutMs: number;
  workingDirectory: string;
}

export interface OrchestrationResult {
  finalText: string;
  toolCalls: NormalizedToolCall[];
  toolResults: ProviderToolResult[];
  totalIterations: number;
  success: boolean;
  error?: string;
}

export class ToolOrchestrator {
  private registry: IToolRegistry;
  private pipeline: ToolExecutionPipeline;
  private config: ToolOrchestratorConfig;

  constructor(
    registry: IToolRegistry,
    pipeline: ToolExecutionPipeline,
    config?: Partial<ToolOrchestratorConfig>,
  ) {
    this.registry = registry;
    this.pipeline = pipeline;
    this.config = {
      maxIterations: config?.maxIterations ?? 10,
      timeoutMs: config?.timeoutMs ?? 60000,
      workingDirectory: config?.workingDirectory ?? process.cwd(),
    };
  }

  public async executeToolCalls(
    toolCalls: NormalizedToolCall[],
    context: ToolExecutionContext,
  ): Promise<ProviderToolResult[]> {
    const results: ProviderToolResult[] = [];

    for (const toolCall of toolCalls) {
      const tool = this.registry.find(toolCall.toolName);
      if (!tool) {
        results.push({
          callId: toolCall.callId,
          output: '',
          success: false,
          error: `Tool '${toolCall.toolName}' not found`,
        });
        continue;
      }

      try {
        const request: ToolExecutionRequest = {
          toolName: toolCall.toolName,
          category: tool.definition.category,
          arguments: toolCall.arguments,
          context,
        };

        const response = await this.pipeline.execute(request, tool);

        results.push({
          callId: toolCall.callId,
          output: response.result.output,
          success: response.result.success,
          error: response.result.error,
        });
      } catch (error) {
        results.push({
          callId: toolCall.callId,
          output: '',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }

  public async runWithToolLoop(
    initialResponse: CompletionResponse,
    context: ToolExecutionContext,
  ): Promise<OrchestrationResult> {
    const allToolCalls: NormalizedToolCall[] = [];
    const allToolResults: ProviderToolResult[] = [];
    let iterations = 0;
    const response = initialResponse;

    while (response.toolCalls.length > 0 && iterations < this.config.maxIterations) {
      iterations++;

      allToolCalls.push(...response.toolCalls);

      const toolResults = await this.executeToolCalls(response.toolCalls, context);
      allToolResults.push(...toolResults);

      if (toolResults.some((r) => !r.success)) {
        const failedTools = toolResults.filter((r) => !r.success);
        return {
          finalText: response.text,
          toolCalls: allToolCalls,
          toolResults: allToolResults,
          totalIterations: iterations,
          success: false,
          error: `Tool execution failed: ${failedTools.map((f) => f.error).join(', ')}`,
        };
      }

      break;
    }

    if (iterations >= this.config.maxIterations) {
      return {
        finalText: response.text,
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        totalIterations: iterations,
        success: false,
        error: `Max iterations (${this.config.maxIterations}) reached`,
      };
    }

    return {
      finalText: response.text,
      toolCalls: allToolCalls,
      toolResults: allToolResults,
      totalIterations: iterations,
      success: true,
    };
  }

  public static toolSpecsFromRegistry(registry: IToolRegistry): NormalizedToolSpec[] {
    const tools = registry.list();
    return tools.map((tool) => ({
      name: tool.definition.name,
      description: tool.definition.description,
      parameters: tool.definition.parametersSchema,
    }));
  }
}
