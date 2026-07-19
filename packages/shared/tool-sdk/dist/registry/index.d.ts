import type { IToolRegistry, ITool, ToolCategory, ToolCapability } from '../interfaces/index.js';
export declare class ToolRegistry implements IToolRegistry {
    private tools;
    private categories;
    register(tool: ITool): void;
    unregister(toolName: string): void;
    find(toolName: string): ITool | undefined;
    list(): ITool[];
    resolve(toolName: string, category: ToolCategory): ITool | undefined;
    findByCategory(category: ToolCategory): ITool[];
    hasCapability(toolName: string, capability: keyof ToolCapability): boolean;
}
//# sourceMappingURL=index.d.ts.map