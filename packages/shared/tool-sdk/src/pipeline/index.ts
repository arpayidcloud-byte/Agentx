import type {
  ToolExecutionPipeline,
  ExecutionHooks,
  ToolExecutionRequest,
  ITool,
  ToolExecutionResponse,
} from '../interfaces/index.js';
import { Tracer, Metrics } from '@agentx/observability';

export class ToolExecutionPipelineImpl implements ToolExecutionPipeline {
  private hooks: ExecutionHooks[] = [];
  private tracer = new Tracer('tool-sdk-pipeline');
  private metrics = new Metrics();

  public addHook(hook: ExecutionHooks): void {
    this.hooks.push(hook);
  }

  public async execute(req: ToolExecutionRequest, tool: ITool): Promise<ToolExecutionResponse> {
    const span = this.tracer.startSpan('tool-execute');
    span.setAttribute('tool.name', tool.definition.name);
    span.setAttribute('tool.category', tool.definition.category);

    // PreExecute hooks
    for (const hook of this.hooks) {
      if (hook.preExecute) {
        await Promise.resolve(hook.preExecute(req, tool));
      }
    }

    let response: ToolExecutionResponse;
    try {
      response = await tool.execute(req);
      this.metrics.counter('tool_executions_success', 1, { tool: tool.definition.name });
      span.setStatus({ code: 0 });
    } catch (error: unknown) {
      this.metrics.counter('tool_executions_error', 1, { tool: tool.definition.name });
      span.setStatus({ code: 1, message: error instanceof Error ? error.message : String(error) });
      // Error hooks
      for (const hook of this.hooks) {
        if (hook.onError) {
          await Promise.resolve(
            hook.onError(error instanceof Error ? error : new Error(String(error)), req, tool),
          );
        }
      }
      throw error;
    } finally {
      span.end();
    }

    // PostExecute hooks
    for (const hook of this.hooks) {
      if (hook.postExecute) {
        await hook.postExecute(response, req, tool);
      }
    }

    return response;
  }
}
