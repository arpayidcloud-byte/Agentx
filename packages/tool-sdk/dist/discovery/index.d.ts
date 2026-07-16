import { IToolDiscovery, ToolManifest, ITool, IToolRegistry } from '../interfaces/index.js';
import { IToolValidator } from '../interfaces/index.js';
export declare class ToolDiscovery implements IToolDiscovery {
    private readonly validator;
    private readonly registry;
    constructor(validator: IToolValidator, registry: IToolRegistry);
    loadManifest(_path: string): Promise<ToolManifest>;
    registerFromManifest(manifest: ToolManifest, tools: ITool[]): void;
    validateVersion(version: string): boolean;
    checkCompatibility(manifest: ToolManifest): boolean;
}
//# sourceMappingURL=index.d.ts.map