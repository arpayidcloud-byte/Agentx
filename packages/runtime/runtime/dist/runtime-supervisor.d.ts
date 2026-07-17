/**
 * @module runtime/runtime-supervisor
 * @description Runtime supervisor for monitoring and recovery.
 */
export declare class RuntimeSupervisor {
    private healthChecker;
    private isRunning;
    constructor();
    private registerDefaultChecks;
    start(): void;
    stop(): void;
    isHealthy(): boolean;
    getHealthStatus(): import("./interfaces.js").HealthStatus[];
    pause(): void;
    resume(): void;
}
//# sourceMappingURL=runtime-supervisor.d.ts.map