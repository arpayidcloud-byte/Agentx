/**
 * @module sub-agents/interfaces
 * @description Interfaces for the Multi-Agent Orchestration Foundation.
 */
export class ToolPermissionEvaluator {
    definitions = new Map();
    register(definition) {
        this.definitions.set(definition.role, definition);
    }
    hasPermission(role, toolCategory) {
        const def = this.definitions.get(role);
        if (!def)
            return false;
        return def.allowedToolCategories.includes(toolCategory);
    }
}
//# sourceMappingURL=interfaces.js.map