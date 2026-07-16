/**
 * @module runtime/runtime-health-v2
 * @description Enhanced health check service for all runtime components.
 */
export interface HealthCheckResult {
    component: string;
    healthy: boolean;
    latencyMs: number;
    lastChecked: Date;
    details?: Record<string, unknown>;
    error?: string;
}
export interface RuntimeHealthReport {
    overall: boolean;
    components: HealthCheckResult[];
    timestamp: Date;
    uptimeMs: number;
}
export declare class RuntimeHealthService {
    private checks;
    private startTime;
    private lastResults;
    registerCheck(component: string, checkFn: () => Promise<HealthCheckResult>): void;
    checkComponent(component: string): Promise<HealthCheckResult>;
    checkAll(): Promise<RuntimeHealthReport>;
    getLastResults(): Map<string, HealthCheckResult>;
}
//# sourceMappingURL=runtime-health-v2.d.ts.map