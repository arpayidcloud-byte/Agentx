import { IToolValidator, ToolManifest, ITool, IToolRegistry } from '../interfaces/index.js';
export declare class ToolValidator implements IToolValidator {
    validateSchema(schema: Record<string, unknown>, args: Record<string, unknown>): boolean;
    validateManifest(manifest: ToolManifest): boolean;
    validateCapabilities(tool: ITool): boolean;
    detectDuplicate(registry: IToolRegistry, toolName: string): boolean;
}
//# sourceMappingURL=index.d.ts.map