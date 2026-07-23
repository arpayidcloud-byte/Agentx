import type { ToolExecutionPipeline, ExecutionHooks, ToolExecutionRequest, ITool, ToolExecutionResponse } from '../interfaces/index.js';
export declare class ToolExecutionPipelineImpl implements ToolExecutionPipeline {
    private hooks;
    private tracer;
    private metrics;
    private cache;
    private timeoutMs;
    constructor(cacheTtlMs?: number, timeoutMs?: number);
    private cacheTtlMs;
    private generateCacheKey;
    private isReadOperation;
    addHook(hook: ExecutionHooks): void;
    execute(req: ToolExecutionRequest, tool: ITool): Promise<ToolExecutionResponse>;
}
//# sourceMappingURL=index.d.ts.map