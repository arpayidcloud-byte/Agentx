import type { IPermissionResolver, IPermissionEvaluator, PermissionPolicy, ToolCategory, ToolExecutionRequest, ITool, RiskScore } from '../interfaces/index.js';
export declare class PermissionResolver implements IPermissionResolver {
    private policies;
    constructor();
    resolvePolicyForAgent(agentRole: string): PermissionPolicy;
    addPolicy(agentRole: string, policy: PermissionPolicy): void;
}
export declare class PermissionEvaluator implements IPermissionEvaluator {
    private readonly resolver;
    constructor(resolver: IPermissionResolver);
    isAllowed(agentRole: string, category: ToolCategory, riskScore?: RiskScore): boolean;
    evaluate(req: ToolExecutionRequest, tool: ITool): boolean;
}
//# sourceMappingURL=index.d.ts.map