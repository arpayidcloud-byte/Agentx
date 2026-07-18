/**
 * @module runtime-adapters/provider-capability
 * @description Validates provider capabilities against required features.
 */
import type { ProviderCapabilities } from './interfaces.js';
export declare class ProviderCapabilityResolver {
    validateCapabilities(required: Partial<ProviderCapabilities>, actual: ProviderCapabilities): void;
    supportsTransactions(capabilities: ProviderCapabilities): boolean;
    supportsPriorityQueue(capabilities: ProviderCapabilities): boolean;
    supportsDistributedLocks(capabilities: ProviderCapabilities): boolean;
    supportsLeaderElection(capabilities: ProviderCapabilities): boolean;
    supportsTelemetry(capabilities: ProviderCapabilities): boolean;
    supportsSecretRotation(capabilities: ProviderCapabilities): boolean;
}
//# sourceMappingURL=provider-capability.d.ts.map