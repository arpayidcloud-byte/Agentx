import { ToolCategory, ToolClassification, RiskScore, PermissionLevel } from '../interfaces/index.js';
export declare class ToolClassifier {
    static classifyCategory(category: ToolCategory): ToolClassification;
    static getRiskScore(category: ToolCategory): RiskScore;
    static requiresApproval(classification: ToolClassification): boolean;
    static getRequiredPermissionLevel(category: ToolCategory): PermissionLevel;
}
//# sourceMappingURL=index.d.ts.map