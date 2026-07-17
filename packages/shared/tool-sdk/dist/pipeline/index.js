export class ToolExecutionPipelineImpl {
    hooks = [];
    addHook(hook) {
        this.hooks.push(hook);
    }
    async execute(req, tool) {
        // PreExecute hooks
        for (const hook of this.hooks) {
            if (hook.preExecute) {
                await hook.preExecute(req, tool);
            }
        }
        let response;
        try {
            response = await tool.execute(req);
        }
        catch (error) {
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
//# sourceMappingURL=index.js.map