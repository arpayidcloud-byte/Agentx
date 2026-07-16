/**
 * @module runtime-adapters/provider-failover
 * @description Provider Failover Management abstraction.
 */
export class ProviderFailoverManager {
    primary = null;
    secondary = null;
    monitorPrimary(provider) {
        this.primary = provider;
    }
    monitorSecondary(provider) {
        this.secondary = provider;
    }
    async switchProvider() {
        if (this.secondary && this.primary) {
            const temp = this.primary;
            this.primary = this.secondary;
            this.secondary = temp;
            return this.primary;
        }
        throw new Error('Secondary provider not configured for failover');
    }
    async promoteSecondary() {
        if (this.secondary) {
            this.primary = this.secondary;
            this.secondary = null;
        }
    }
    async rollback() {
        // Implementation for rollback logic if needed
    }
    async recover() {
        // Implementation for recovery logic if needed
    }
    getPrimary() {
        return this.primary;
    }
    getSecondary() {
        return this.secondary;
    }
}
//# sourceMappingURL=provider-failover.js.map