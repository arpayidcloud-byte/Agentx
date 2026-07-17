import { ToolExecutionPipeline, ExecutionHooks, ToolExecutionRequest, ITool, ToolExecutionResponse } from '../interfaces/index.js';

export class ToolExecutionPipelineImpl implements ToolExecutionPipeline {
  private hooks: ExecutionHooks[] = [];

  public addHook(hook: ExecutionHooks): void {
    this.hooks.push(hook);
  }

  public async execute(req: ToolExecutionRequest, tool: ITool): Promise<ToolExecutionResponse> {
    // PreExecute hooks
    for (const hook of this.hooks) {
      if (hook.preExecute) {
        await hook.preExecute(req, tool);
      }
    }

    let response: ToolExecutionResponse;
    try {
      response = await tool.execute(req);
    } catch (error: unknown) {
      // Error hooks
      for (const hook of this.hooks) {
        if (hook.onError) {
          await hook.onError(error instanceof Error ? error : new Error(String(error)), req, tool);
        }
      }
      throw error;
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
