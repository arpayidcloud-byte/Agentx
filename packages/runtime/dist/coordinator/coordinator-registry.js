/**
 * @module coordinator/coordinator-registry
 * @description Dependency injection registry for the coordinator.
 */
export class CoordinatorRegistry {
    services = new Map();
    register(name, service) {
        this.services.set(name, service);
    }
    resolve(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service not found: ${name}`);
        }
        return service;
    }
    has(name) {
        return this.services.has(name);
    }
    clear() {
        this.services.clear();
    }
}
//# sourceMappingURL=coordinator-registry.js.map