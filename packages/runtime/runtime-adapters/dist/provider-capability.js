/**
 * @module runtime-adapters/provider-capability
 * @description Validates provider capabilities against required features.
 */
import { UnsupportedProviderCapabilityError } from './errors.js';
export class ProviderCapabilityResolver {
    validateCapabilities(required, actual) {
        if (required.transactions && !actual.transactions) {
            throw new UnsupportedProviderCapabilityError('Transactions not supported', 'capability-resolver');
        }
        if (required.priorityQueue && !actual.priorityQueue) {
            throw new UnsupportedProviderCapabilityError('Priority Queue not supported', 'capability-resolver');
        }
        if (required.distributedLocks && !actual.distributedLocks) {
            throw new UnsupportedProviderCapabilityError('Distributed Locks not supported', 'capability-resolver');
        }
        if (required.leaderElection && !actual.leaderElection) {
            throw new UnsupportedProviderCapabilityError('Leader Election not supported', 'capability-resolver');
        }
        if (required.telemetry && !actual.telemetry) {
            throw new UnsupportedProviderCapabilityError('Telemetry not supported', 'capability-resolver');
        }
        if (required.secretRotation && !actual.secretRotation) {
            throw new UnsupportedProviderCapabilityError('Secret Rotation not supported', 'capability-resolver');
        }
    }
    supportsTransactions(capabilities) {
        return capabilities.transactions === true;
    }
    supportsPriorityQueue(capabilities) {
        return capabilities.priorityQueue === true;
    }
    supportsDistributedLocks(capabilities) {
        return capabilities.distributedLocks === true;
    }
    supportsLeaderElection(capabilities) {
        return capabilities.leaderElection === true;
    }
    supportsTelemetry(capabilities) {
        return capabilities.telemetry === true;
    }
    supportsSecretRotation(capabilities) {
        return capabilities.secretRotation === true;
    }
}
//# sourceMappingURL=provider-capability.js.map