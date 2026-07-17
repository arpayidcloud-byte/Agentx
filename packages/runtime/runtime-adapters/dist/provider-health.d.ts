/**
 * @module runtime-adapters/provider-health
 * @description Provider health monitoring abstraction.
 */
import { IProvider, ProviderHealth } from './interfaces.js';
export declare class ProviderHealthMonitor {
    private history;
    health(provider: IProvider): Promise<ProviderHealth>;
    ping(provider: IProvider): Promise<number>;
    latency(providerId: string): number;
    availability(providerId: string): number;
    failureCount(providerId: string): number;
    lastFailure(providerId: string): Date | undefined;
    getHistory(providerId: string): ProviderHealth[];
}
//# sourceMappingURL=provider-health.d.ts.map