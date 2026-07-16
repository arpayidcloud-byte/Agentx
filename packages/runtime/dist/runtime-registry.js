/**
 * @module runtime/runtime-registry
 * @description Runtime component registry for dependency injection.
 */
export class RuntimeRegistry {
    components = new Map();
    register(name, instance) {
        this.components.set(name, { name, instance, registeredAt: new Date() });
    }
    get(name) {
        return this.components.get(name)?.instance;
    }
    has(name) {
        return this.components.has(name);
    }
    remove(name) {
        this.components.delete(name);
    }
    list() {
        return Array.from(this.components.values());
    }
    clear() {
        this.components.clear();
    }
}
//# sourceMappingURL=runtime-registry.js.map