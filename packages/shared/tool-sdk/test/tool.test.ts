import { describe, it, expect, vi } from 'vitest';
import {
  ToolClassifier,
  PermissionResolver,
  PermissionEvaluator,
  ToolRegistry,
  ToolValidator,
  ToolDiscovery,
  ToolExecutionPipelineImpl,
  ITool,
  PermissionLevel,
  ToolNotFoundError,
  DuplicateToolError,
  SchemaValidationError,
  ManifestValidationError,
  PermissionDeniedError,
  SandboxViolationError,
  CapabilityViolationError,
} from '../src/index.js';

describe('Errors', () => {
  it('instantiates all error classes correctly', () => {
    expect(new SandboxViolationError('test')).toBeInstanceOf(Error);
    expect(new CapabilityViolationError('test')).toBeInstanceOf(Error);
    expect(new ManifestValidationError('test')).toBeInstanceOf(Error);
    expect(new ToolNotFoundError('test')).toBeInstanceOf(Error);
    expect(new DuplicateToolError('test')).toBeInstanceOf(Error);
    expect(new PermissionDeniedError('coding', 'fs.write', 'reason')).toBeInstanceOf(Error);
    expect(new SchemaValidationError(['err1', 'err2'])).toBeInstanceOf(Error);
  });
});

describe('ToolClassifier', () => {
  it('classifies tool categories correctly', () => {
    expect(ToolClassifier.classifyCategory('fs.write')).toBe('Destructive');
    expect(ToolClassifier.classifyCategory('shell.exec')).toBe('Destructive');
    expect(ToolClassifier.classifyCategory('git.write')).toBe('Destructive');
    expect(ToolClassifier.classifyCategory('shell.build')).toBe('PotentiallyDestructive');
    expect(ToolClassifier.classifyCategory('fs.read')).toBe('Safe');
    expect(ToolClassifier.classifyCategory('git.read')).toBe('Safe');
    expect(ToolClassifier.classifyCategory('unknown.category')).toBe('Safe');
  });

  it('determines risk scores correctly', () => {
    expect(ToolClassifier.getRiskScore('fs.write')).toBe(90);
    expect(ToolClassifier.getRiskScore('shell.build')).toBe(50);
    expect(ToolClassifier.getRiskScore('fs.read')).toBe(10);

    // Test default classification score via mock
    vi.spyOn(ToolClassifier, 'classifyCategory').mockReturnValueOnce('Unknown' as any);
    expect(ToolClassifier.getRiskScore('unknown')).toBe(100);
    vi.restoreAllMocks();
  });

  it('identifies if approval is required', () => {
    expect(ToolClassifier.requiresApproval('Destructive')).toBe(true);
    expect(ToolClassifier.requiresApproval('PotentiallyDestructive')).toBe(false);
    expect(ToolClassifier.requiresApproval('Safe')).toBe(false);
  });

  it('maps required permission levels', () => {
    expect(ToolClassifier.getRequiredPermissionLevel('fs.write')).toBe(PermissionLevel.DESTRUCTIVE);
    expect(ToolClassifier.getRequiredPermissionLevel('shell.build')).toBe(PermissionLevel.WRITE);
    expect(ToolClassifier.getRequiredPermissionLevel('fs.read')).toBe(PermissionLevel.READ_ONLY);

    vi.spyOn(ToolClassifier, 'classifyCategory').mockReturnValueOnce('Unknown' as any);
    expect(ToolClassifier.getRequiredPermissionLevel('unknown')).toBe(PermissionLevel.SYSTEM);
    vi.restoreAllMocks();
  });
});

describe('Permissions', () => {
  const resolver = new PermissionResolver();
  const evaluator = new PermissionEvaluator(resolver);

  it('resolves default policies for agent roles', () => {
    expect(resolver.resolvePolicyForAgent('coding').allowedCategories).toContain('fs.write');
    expect(resolver.resolvePolicyForAgent('review').allowedCategories).not.toContain('fs.write');
    expect(resolver.resolvePolicyForAgent('unknown').allowedCategories).toEqual([]);
  });

  it('allows adding custom policies', () => {
    resolver.addPolicy('custom', { allowedCategories: ['custom.read'], maxRiskScore: 20 });
    expect(resolver.resolvePolicyForAgent('custom').allowedCategories).toContain('custom.read');
  });

  it('evaluates permissions based on allowed and blocked categories', () => {
    expect(evaluator.isAllowed('coding', 'fs.write')).toBe(true);
    expect(evaluator.isAllowed('review', 'fs.write')).toBe(false);
    expect(evaluator.isAllowed('unknown', 'fs.read')).toBe(false);

    resolver.addPolicy('testAgent', {
      allowedCategories: ['fs.read'],
      blockedCategories: ['fs.read'],
    });
    expect(evaluator.isAllowed('testAgent', 'fs.read')).toBe(false);
  });

  it('evaluates risk scores', () => {
    resolver.addPolicy('riskAgent', { allowedCategories: ['fs.read'], maxRiskScore: 15 });
    expect(evaluator.isAllowed('riskAgent', 'fs.read', 10)).toBe(true);
    expect(evaluator.isAllowed('riskAgent', 'fs.read', 20)).toBe(false);
  });

  it('evaluates full requests and throws on denial', () => {
    const req = {
      context: { agentRole: 'review' },
      category: 'fs.write',
      toolName: 'WriteTool',
    } as any;
    const tool = { metadata: { riskScore: 90 } } as any;

    expect(() => evaluator.evaluate(req, tool)).toThrow(PermissionDeniedError);

    const validReq = {
      context: { agentRole: 'coding' },
      category: 'fs.read',
      toolName: 'ReadTool',
    } as any;
    const validTool = { metadata: { riskScore: 10 } } as any;
    expect(evaluator.evaluate(validReq, validTool)).toBe(true);
  });
});

describe('ToolRegistry & Duplicate Detection', () => {
  const mockTool = (name: string, category: string): ITool => ({
    definition: { name, category, capabilities: { supportsStreaming: true } } as any,
    metadata: {} as any,
    execute: vi.fn(),
  });

  it('registers and finds tools', () => {
    const registry = new ToolRegistry();
    const t1 = mockTool('tool1', 'fs.read');
    registry.register(t1);

    expect(registry.find('tool1')).toBe(t1);
    expect(registry.find('missing')).toBeUndefined();
    expect(registry.list()).toContain(t1);
    expect(registry.resolve('tool1', 'fs.read')).toBe(t1);
    expect(registry.resolve('tool1', 'fs.write')).toBeUndefined();
    expect(registry.findByCategory('fs.read')).toContain(t1);
    expect(registry.hasCapability('tool1', 'supportsStreaming')).toBe(true);
    expect(registry.hasCapability('missing', 'supportsStreaming')).toBe(false);
  });

  it('detects duplicates', () => {
    const registry = new ToolRegistry();
    registry.register(mockTool('tool1', 'fs.read'));
    expect(() => registry.register(mockTool('tool1', 'fs.write'))).toThrow(DuplicateToolError);
  });

  it('unregisters tools correctly', () => {
    const registry = new ToolRegistry();
    const t1 = mockTool('tool1', 'fs.read');
    registry.register(t1);
    registry.unregister('tool1');

    expect(registry.find('tool1')).toBeUndefined();
    expect(registry.findByCategory('fs.read')).not.toContain(t1);
    expect(() => registry.unregister('tool1')).toThrow(ToolNotFoundError);
  });

  it('returns empty array when finding missing categories', () => {
    const registry = new ToolRegistry();
    expect(registry.findByCategory('missing')).toEqual([]);
  });
});

describe('ToolValidator', () => {
  const validator = new ToolValidator();

  it('validates simple schemas', () => {
    const schema = { required: ['path'] };
    expect(validator.validateSchema(schema, { path: '/' })).toBe(true);
    expect(() => validator.validateSchema(schema, {})).toThrow(SchemaValidationError);
    expect(() => validator.validateSchema(null as any, {})).toThrow(SchemaValidationError);
  });

  it('validates manifests', () => {
    const validManifest = {
      id: 'test',
      version: '1.0.0',
      kind: 'tool',
      entryPoint: 'main.js',
      declaredToolCategories: ['fs.read'],
      tools: [{}],
    } as any;
    expect(validator.validateManifest(validManifest)).toBe(true);

    expect(() => validator.validateManifest({ ...validManifest, id: null })).toThrow('id');
    expect(() => validator.validateManifest({ ...validManifest, version: null })).toThrow(
      'version',
    );
    expect(() => validator.validateManifest({ ...validManifest, kind: 'invalid' })).toThrow('kind');
    expect(() => validator.validateManifest({ ...validManifest, entryPoint: null })).toThrow(
      'entryPoint',
    );
    expect(() =>
      validator.validateManifest({ ...validManifest, declaredToolCategories: [] }),
    ).toThrow('category');
    expect(() => validator.validateManifest({ ...validManifest, tools: [] })).toThrow(
      'define at least one tool',
    );
  });

  it('validates capabilities', () => {
    const validTool = {
      definition: {
        capabilities: {
          supportsStreaming: true,
          supportsCancellation: true,
          requiresNetwork: false,
          requiresFilesystem: true,
        },
      },
    } as any;
    expect(validator.validateCapabilities(validTool)).toBe(true);

    const invalidTool = { definition: { capabilities: null } } as any;
    expect(validator.validateCapabilities(invalidTool)).toBe(false);
  });

  it('detects duplicates using validator interface', () => {
    const registry = new ToolRegistry();
    registry.register({ definition: { name: 't1', category: 'c' } } as any);
    expect(() => validator.detectDuplicate(registry, 't1')).toThrow(DuplicateToolError);
    expect(validator.detectDuplicate(registry, 't2')).toBe(false);
  });
});

describe('ToolDiscovery', () => {
  const validator = new ToolValidator();
  const registry = new ToolRegistry();
  const discovery = new ToolDiscovery(validator, registry);

  it('validates versions and compatibility', () => {
    expect(discovery.validateVersion('1.0.0')).toBe(true);
    expect(discovery.validateVersion('1.0')).toBe(false);
    expect(discovery.checkCompatibility({ version: '1.0.0' } as any)).toBe(true);
  });

  it('registers tools from manifest successfully', () => {
    const manifest = {
      id: 'm1',
      version: '1.0.0',
      kind: 'tool',
      entryPoint: 'main.js',
      declaredToolCategories: ['fs.read'],
      tools: [{}],
    } as any;
    const tools = [{ definition: { name: 'dt1', category: 'fs.read' } }] as any;

    discovery.registerFromManifest(manifest, tools);
    expect(registry.find('dt1')).toBeDefined();
  });

  it('throws error if tool category not declared in manifest', () => {
    const manifest = {
      id: 'm2',
      version: '1.0.0',
      kind: 'tool',
      entryPoint: 'main.js',
      declaredToolCategories: ['fs.read'],
      tools: [{}],
    } as any;
    const tools = [{ definition: { name: 'dt2', category: 'fs.write' } }] as any;

    expect(() => discovery.registerFromManifest(manifest, tools)).toThrow(
      'not declared in the manifest',
    );
  });

  it('throws error on loadManifest (M2.1 restriction)', async () => {
    await expect(discovery.loadManifest('test')).rejects.toThrow(
      'Filesystem access not permitted in M2.1',
    );
  });
});

describe('ToolExecutionPipeline', () => {
  it('executes pre, post, and error hooks correctly', async () => {
    const pipeline = new ToolExecutionPipelineImpl();
    const req = {} as any;
    const res = { result: { success: true } } as any;
    const tool = { execute: vi.fn().mockResolvedValue(res) } as any;

    const preHook = vi.fn();
    const postHook = vi.fn();
    const errHook = vi.fn();

    pipeline.addHook({ preExecute: preHook, postExecute: postHook, onError: errHook });
    pipeline.addHook({}); // Empty hook

    const output = await pipeline.execute(req, tool);
    expect(output).toBe(res);
    expect(preHook).toHaveBeenCalled();
    expect(postHook).toHaveBeenCalled();
    expect(errHook).not.toHaveBeenCalled();

    // Error test
    const failTool = { execute: vi.fn().mockRejectedValue(new Error('fail')) } as any;
    await expect(pipeline.execute(req, failTool)).rejects.toThrow('fail');
    expect(errHook).toHaveBeenCalled();
  });

  it('executes error hook and wraps string errors', async () => {
    const pipeline = new ToolExecutionPipelineImpl();
    const errHook = vi.fn();
    pipeline.addHook({ onError: errHook });

    const failTool = { execute: vi.fn().mockRejectedValue('string error') } as any;
    await expect(pipeline.execute({} as any, failTool)).rejects.toThrow('string error');
    expect(errHook).toHaveBeenCalled();
  });
});
