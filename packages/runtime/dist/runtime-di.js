/**
 * @module runtime/runtime-di
 * @description Dependency injection container for the runtime.
 */
export class RuntimeDI {
    services = new Map();
    factories = new Map();
    register(name, instance) {
        this.services.set(name, instance);
    }
    registerFactory(name, factory) {
        this.factories.set(name, factory);
    }
    resolve(name) {
        if (this.services.has(name)) {
            return this.services.get(name);
        }
        if (this.factories.has(name)) {
            const instance = this.factories.get(name)();
            this.services.set(name, instance);
            return instance;
        }
        throw new Error(`Service '${name}' not registered`);
    }
    has(name) {
        return this.services.has(name) || this.factories.has(name);
    }
    remove(name) {
        this.services.delete(name);
        this.factories.delete(name);
    }
    clear() {
        this.services.clear();
        this.factories.clear();
    }
}
//# sourceMappingURL=runtime-di.js.map