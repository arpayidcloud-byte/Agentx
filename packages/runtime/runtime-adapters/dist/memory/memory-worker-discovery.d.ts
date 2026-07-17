/**
 * @module runtime-adapters/memory/memory-worker-discovery
 * @description Reference in-memory service discovery provider.
 */
import { IWorkerDiscoveryProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '../interfaces.js';
export declare class MemoryWorkerDiscoveryProvider implements IWorkerDiscoveryProvider {
    private workers;
    private total;
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    registerWorker(workerId: string, metadata: Record<string, unknown>): Promise<void>;
    heartbeat(_workerId: string): Promise<void>;
    listWorkers(): Promise<Array<{
        id: string;
        metadata: Record<string, unknown>;
    }>>;
    removeWorker(workerId: string): Promise<void>;
    discover(capability: string): Promise<string[]>;
}
//# sourceMappingURL=memory-worker-discovery.d.ts.map