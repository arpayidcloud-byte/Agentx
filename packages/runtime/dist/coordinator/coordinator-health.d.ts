/**
 * @module coordinator/coordinator-health
 * @description Health checking service for all coordinator components.
 */
import { CoordinatorHealthStatus } from './interfaces.js';
export declare class CoordinatorHealthChecker {
    private checks;
    register(component: string, checkFn: () => CoordinatorHealthStatus): void;
    check(component: string): CoordinatorHealthStatus;
    checkAll(): CoordinatorHealthStatus[];
    isHealthy(): boolean;
}
//# sourceMappingURL=coordinator-health.d.ts.map