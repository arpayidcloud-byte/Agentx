/**
 * @module runtime-adapters/provider-failover
 * @description Provider Failover Management abstraction.
 */
import { IProvider } from './interfaces.js';
export declare class ProviderFailoverManager {
    private primary;
    private secondary;
    monitorPrimary(provider: IProvider): void;
    monitorSecondary(provider: IProvider): void;
    switchProvider(): Promise<IProvider>;
    promoteSecondary(): Promise<void>;
    rollback(): Promise<void>;
    recover(): Promise<void>;
    getPrimary(): IProvider | null;
    getSecondary(): IProvider | null;
}
//# sourceMappingURL=provider-failover.d.ts.map