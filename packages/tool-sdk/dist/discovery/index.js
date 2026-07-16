export class ToolDiscovery {
    validator;
    registry;
    constructor(validator, registry) {
        this.validator = validator;
        this.registry = registry;
    }
    async loadManifest(_path) {
        // Simulated manifest loading for foundation package.
        // In M2.2, this reads from the filesystem or imports a module.
        // Since ADR-0016 requires NO filesystem/network access in foundation:
        throw new Error('Filesystem access not permitted in M2.1 foundation package');
    }
    registerFromManifest(manifest, tools) {
        this.validator.validateManifest(manifest);
        for (const tool of tools) {
            this.validator.detectDuplicate(this.registry, tool.definition.name);
            // Ensure the tool category matches one of the declared categories in the manifest
            if (!manifest.declaredToolCategories.includes(tool.definition.category)) {
                throw new Error(`Tool category '${tool.definition.category}' is not declared in the manifest`);
            }
            this.registry.register(tool);
        }
    }
    validateVersion(version) {
        const semverRegex = /^\d+\.\d+\.\d+$/;
        return semverRegex.test(version);
    }
    checkCompatibility(manifest) {
        return this.validateVersion(manifest.version);
    }
}
//# sourceMappingURL=index.js.map