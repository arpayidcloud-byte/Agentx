/**
 * @module runtime/runtime-registry
 * @description Runtime component registry for dependency injection.
 */
export interface ComponentEntry {
    name: string;
    instance: unknown;
    registeredAt: Date;
}
export declare class RuntimeRegistry {
    private components;
    register(name: string, instance: unknown): void;
    get<T>(name: string): T | undefined;
    has(name: string): boolean;
    remove(name: string): void;
    list(): ComponentEntry[];
    clear(): void;
}
//# sourceMappingURL=runtime-registry.d.ts.map