import type {
  ToolExecutionPipeline,
  ExecutionHooks,
  ToolExecutionRequest,
  ITool,
  ToolExecutionResponse,
} from '../interfaces/index.js';
import { Tracer, Metrics } from '@agentx/observability';
import { CacheManager } from '@agentx/cache';

interface CacheKey {
  toolName: string;
  category: string;
  argsHash: string;
  workingDirectory: string;
}

export class ToolExecutionPipelineImpl implements ToolExecutionPipeline {
  private hooks: ExecutionHooks[] = [];
  private tracer = new Tracer('tool-sdk-pipeline');
  private metrics = new Metrics();
  private cache: CacheManager<string, ToolExecutionResponse>;

  constructor(cacheTtlMs: number = 300_000) {
    this.cache = new CacheManager<string, ToolExecutionResponse>();
    this.cacheTtlMs = cacheTtlMs;
  }

  private cacheTtlMs: number;

  private generateCacheKey(req: ToolExecutionRequest): string {
    const key: CacheKey = {
      toolName: req.toolName || 'unknown',
      category: req.category || 'unknown',
      argsHash: JSON.stringify(req.arguments || {}),
      workingDirectory: req.context?.workingDirectory || '',
    };
    return `tool:${key.category}:${key.toolName}:${Buffer.from(key.argsHash).toString('base64')}:${key.workingDirectory}`;
  }

  private isReadOperation(category: string): boolean {
    return category?.endsWith('.read') ?? false;
  }

  public addHook(hook: ExecutionHooks): void {
    this.hooks.push(hook);
  }

  public async execute(req: ToolExecutionRequest, tool: ITool): Promise<ToolExecutionResponse> {
    const span = this.tracer.startSpan('tool-execute');
    span.setAttribute('tool.name', tool.definition.name);
    span.setAttribute('tool.category', tool.definition.category);

    // Check cache for read operations
    const cacheKey = this.generateCacheKey(req);
    if (this.isReadOperation(req.category)) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        this.metrics.counter('tool_cache_hit', 1, { tool: tool.definition.name });
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

    let response: ToolExecutionResponse;
    try {
      response = await tool.execute(req);

      // Cache successful read operations
      if (this.isReadOperation(req.category) && response.result.success) {
        await this.cache.set(cacheKey, response, this.cacheTtlMs);
      }

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
