import { Tracer, Metrics } from '@agentx/observability';
import { CacheManager } from '@agentx/cache';
import { createTimeoutController } from '../shell/timeout.js';
export class ToolExecutionPipelineImpl {
    hooks = [];
    tracer = new Tracer('tool-sdk-pipeline');
    metrics = new Metrics();
    cache;
    timeoutMs;
    constructor(cacheTtlMs = 300_000, timeoutMs = 60000) {
        this.cache = new CacheManager();
        this.cacheTtlMs = cacheTtlMs;
        this.timeoutMs = timeoutMs;
    }
    cacheTtlMs;
    generateCacheKey(req) {
        const key = {
            toolName: req.toolName || 'unknown',
            category: req.category || 'unknown',
            argsHash: JSON.stringify(req.arguments || {}),
            workingDirectory: req.context?.workingDirectory || '',
        };
        return `tool:${key.category}:${key.toolName}:${Buffer.from(key.argsHash).toString('base64')}:${key.workingDirectory}`;
    }
    isReadOperation(category) {
        return category?.endsWith('.read') ?? false;
    }
    addHook(hook) {
        this.hooks.push(hook);
    }
    async execute(req, tool) {
        const span = this.tracer.startSpan('tool-execute');
        span.setAttribute('tool.name', tool.definition.name);
        span.setAttribute('tool.category', tool.definition.category);
        const startTime = Date.now();
        // Check cache for read operations
        const cacheKey = this.generateCacheKey(req);
        if (this.isReadOperation(req.category)) {
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                const durationMs = Date.now() - startTime;
                this.metrics.counter('tool_cache_hit', 1, { tool: tool.definition.name });
                this.metrics.histogram('tool_execution_latency', durationMs, {
                    tool: tool.definition.name,
                    category: tool.definition.category,
                    cached: 'true',
                });
                span.setAttribute('tool.cache_hit', true);
                span.end();
                return cached;
            }
            this.metrics.counter('tool_cache_miss', 1, { tool: tool.definition.name });
            span.setAttribute('tool.cache_hit', false);
        }
        // PreExecute hooks
        for (const hook of this.hooks) {
            if (hook.preExecute) {
                await Promise.resolve(hook.preExecute(req, tool));
            }
        }
        let response;
        const { controller, cleanup } = createTimeoutController({ timeoutMs: this.timeoutMs });
        try {
            // Execute with timeout
            response = await Promise.race([
                tool.execute(req),
                new Promise((_, reject) => {
                    controller.signal.addEventListener('abort', () => {
                        reject(new Error(`Tool execution timed out after ${this.timeoutMs}ms`));
                    });
                }),
            ]);
            // Cache successful read operations
            if (this.isReadOperation(req.category) && response.result.success) {
                await this.cache.set(cacheKey, response, this.cacheTtlMs);
            }
            const durationMs = Date.now() - startTime;
            this.metrics.counter('tool_executions_success', 1, { tool: tool.definition.name });
            this.metrics.histogram('tool_execution_latency', durationMs, {
                tool: tool.definition.name,
                category: tool.definition.category,
                cached: 'false',
            });
            span.setStatus({ code: 0 });
        }
        catch (error) {
            const durationMs = Date.now() - startTime;
            this.metrics.counter('tool_executions_error', 1, { tool: tool.definition.name });
            this.metrics.histogram('tool_execution_latency', durationMs, {
                tool: tool.definition.name,
                category: tool.definition.category,
                cached: 'false',
                error: 'true',
            });
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
            cleanup();
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