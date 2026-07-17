/**
 * @module coordinator/coordinator-registry
 * @description Dependency injection registry for the coordinator.
 */
export declare class CoordinatorRegistry {
    private services;
    register<T>(name: string, service: T): void;
    resolve<T>(name: string): T;
    has(name: string): boolean;
    clear(): void;
}
//# sourceMappingURL=coordinator-registry.d.ts.map