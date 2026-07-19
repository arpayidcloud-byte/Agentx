/**
 * @module runtime/runtime-health
 * @description Health check endpoints for all runtime components.
 */
export class HealthChecker {
    checks = new Map();
    /**
     * Registers a health check
     * @param component - Component name
     * @param checkFn - Health check function
     */
    register(component, checkFn) {
        this.checks.set(component, checkFn);
    }
    /**
     * Checks health of a specific component
     * @param component - Component name
     * @returns HealthStatus
     */
    check(component) {
        const checkFn = this.checks.get(component);
        if (!checkFn) {
            return {
                component,
                healthy: false,
                latencyMs: 0,
                details: { error: 'Component not registered' },
            };
        }
        return checkFn();
    }
    /**
     * Checks all components
     * @returns Array of HealthStatus
     */
    checkAll() {
        const results = [];
        for (const [, checkFn] of this.checks) {
            results.push(checkFn());
        }
        return results;
    }
    /**
     * Checks if all components are healthy
     * @returns true if all healthy
     */
    isHealthy() {
        return this.checkAll().every((status) => status.healthy);
    }
}
/**
 * Creates a default health check for a component
 * @param component - Component name
 * @returns HealthStatus
 */
export function defaultHealthCheck(_component) {
    return { component: _component, healthy: true, latencyMs: 0 };
}
//# sourceMappingURL=runtime-health.js.map