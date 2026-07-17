import { PermissionDeniedError } from '../errors/index.js';
export class PermissionResolver {
    policies = new Map();
    constructor() {
        // Default v0.1 permissions per Volume 7 Ch.2 and Vol 3 Ch.2
        this.policies.set('coding', {
            allowedCategories: ['fs.read', 'fs.write', 'shell.build', 'shell.exec', 'git.read', 'git.write'],
            maxRiskScore: 100
        });
        this.policies.set('review', {
            allowedCategories: ['fs.read', 'git.read'],
            maxRiskScore: 50
        });
        this.policies.set('test', {
            allowedCategories: ['fs.read', 'fs.write', 'shell.build', 'shell.exec'],
            maxRiskScore: 100
        });
        this.policies.set('security', {
            allowedCategories: ['fs.read', 'git.read'],
            maxRiskScore: 50
        });
    }
    resolvePolicyForAgent(agentRole) {
        return this.policies.get(agentRole) || { allowedCategories: [], maxRiskScore: 0 };
    }
    addPolicy(agentRole, policy) {
        this.policies.set(agentRole, policy);
    }
}
export class PermissionEvaluator {
    resolver;
    constructor(resolver) {
        this.resolver = resolver;
    }
    isAllowed(agentRole, category, riskScore) {
        const policy = this.resolver.resolvePolicyForAgent(agentRole);
        // Check blocked categories first
        if (policy.blockedCategories?.includes(category)) {
            return false;
        }
        // Check allowed categories
        if (!policy.allowedCategories.includes(category)) {
            return false;
        }
        // Check risk score if provided and policy has a max
        if (riskScore !== undefined && policy.maxRiskScore !== undefined) {
            if (riskScore > policy.maxRiskScore) {
                return false;
            }
        }
        return true;
    }
    evaluate(req, tool) {
        const allowed = this.isAllowed(req.context.agentRole, req.category, tool.metadata.riskScore);
        if (!allowed) {
            throw new PermissionDeniedError(req.context.agentRole, req.category, `Tool ${req.toolName} requires permissions not granted to ${req.context.agentRole}`);
        }
        return true;
    }
}
//# sourceMappingURL=index.js.map