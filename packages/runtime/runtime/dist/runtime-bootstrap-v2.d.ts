/**
 * @module runtime/runtime-bootstrap-v2
 * @description Bootstrap configuration for the production runtime.
 */
import type { RuntimeConfig } from './interfaces.js';
import type { IAuditStore } from './audit-store.js';
import type { ICheckpointStore } from './checkpoint-store.js';
import { RuntimeDI } from './runtime-di.js';
export interface RuntimeBootstrapConfig {
    config: RuntimeConfig;
    auditStore?: IAuditStore;
    checkpointStore?: ICheckpointStore;
    useMemoryStores?: boolean;
}
export declare class RuntimeBootstrap {
    private di;
    constructor();
    bootstrap(config?: RuntimeBootstrapConfig): Promise<RuntimeDI>;
    getDI(): RuntimeDI;
}
//# sourceMappingURL=runtime-bootstrap-v2.d.ts.map