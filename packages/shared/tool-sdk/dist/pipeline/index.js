import { Tracer, Metrics } from '@agentx/observability';
export class ToolExecutionPipelineImpl {
    hooks = [];
    tracer = new Tracer('tool-sdk-pipeline');
    metrics = new Metrics();
    addHook(hook) {
        this.hooks.push(hook);
    }
    async execute(req, tool) {
        const span = this.tracer.startSpan('tool-execute');
        span.setAttribute('tool.name', tool.definition.name);
        span.setAttribute('tool.category', tool.definition.category);
        // PreExecute hooks
        for (const hook of this.hooks) {
            if (hook.preExecute) {
                await Promise.resolve(hook.preExecute(req, tool));
            }
        }
        let response;
        try {
            response = await tool.execute(req);
            this.metrics.counter('tool_executions_success', 1, { tool: tool.definition.name });
            span.setStatus({ code: 0 });
        }
        catch (error) {
            this.metrics.counter('tool_executions_error', 1, { tool: tool.definition.name });
            span.setStatus({ code: 1, message: error instanceof Error ? error.message : String(error) });
            // Error hooks
            for (const hook of this.hooks) {
                if (hook.onError) {
                    await Promise.resolve(hook.onError(error instanceof Error ? error : new Error(String(error)), req, tool));
                }
            }
            throw error;
        }
        finally {
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
//# sourceMappingURL=index.js.map