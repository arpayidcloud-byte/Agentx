/**
 * @module runtime/runtime-di
 * @description Dependency injection container for the runtime.
 */
export declare class RuntimeDI {
    private services;
    private factories;
    register<T>(name: string, instance: T): void;
    registerFactory<T>(name: string, factory: () => T): void;
    resolve<T>(name: string): T;
    has(name: string): boolean;
    remove(name: string): void;
    clear(): void;
}
//# sourceMappingURL=runtime-di.d.ts.map