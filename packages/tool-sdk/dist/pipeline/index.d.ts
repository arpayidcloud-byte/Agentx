import { ToolExecutionPipeline, ExecutionHooks, ToolExecutionRequest, ITool, ToolExecutionResponse } from '../interfaces/index.js';
export declare class ToolExecutionPipelineImpl implements ToolExecutionPipeline {
    private hooks;
    addHook(hook: ExecutionHooks): void;
    execute(req: ToolExecutionRequest, tool: ITool): Promise<ToolExecutionResponse>;
}
//# sourceMappingURL=index.d.ts.map