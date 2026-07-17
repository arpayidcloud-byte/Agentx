/**
 * @module runtime/runtime-health
 * @description Health check endpoints for all runtime components.
 */
import { HealthStatus } from './interfaces.js';
export declare class HealthChecker {
    private checks;
    /**
     * Registers a health check
     * @param component - Component name
     * @param checkFn - Health check function
     */
    register(component: string, checkFn: () => HealthStatus): void;
    /**
     * Checks health of a specific component
     * @param component - Component name
     * @returns HealthStatus
     */
    check(component: string): HealthStatus;
    /**
     * Checks all components
     * @returns Array of HealthStatus
     */
    checkAll(): HealthStatus[];
    /**
     * Checks if all components are healthy
     * @returns true if all healthy
     */
    isHealthy(): boolean;
}
/**
 * Creates a default health check for a component
 * @param component - Component name
 * @returns HealthStatus
 */
export declare function defaultHealthCheck(_component: string): HealthStatus;
//# sourceMappingURL=runtime-health.d.ts.map