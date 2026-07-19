/**
 * @module coordinator/coordinator-health
 * @description Health checking service for all coordinator components.
 */
export class CoordinatorHealthChecker {
    checks = new Map();
    register(component, checkFn) {
        this.checks.set(component, checkFn);
    }
    check(component) {
        const fn = this.checks.get(component);
        if (!fn) {
            return { component, healthy: false, details: { error: 'Not registered' } };
        }
        return fn();
    }
    checkAll() {
        return Array.from(this.checks.values()).map((fn) => fn());
    }
    isHealthy() {
        return this.checkAll().every((status) => status.healthy);
    }
}
//# sourceMappingURL=coordinator-health.js.map