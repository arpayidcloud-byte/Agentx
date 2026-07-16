import { DuplicateToolError, ToolNotFoundError } from '../errors/index.js';
export class ToolRegistry {
    tools = new Map();
    categories = new Map();
    register(tool) {
        const name = tool.definition.name;
        if (this.tools.has(name)) {
            throw new DuplicateToolError(name);
        }
        this.tools.set(name, tool);
        const category = tool.definition.category;
        if (!this.categories.has(category)) {
            this.categories.set(category, new Set());
        }
        this.categories.get(category).add(name);
    }
    unregister(toolName) {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new ToolNotFoundError(toolName);
        }
        this.tools.delete(toolName);
        const category = tool.definition.category;
        const categorySet = this.categories.get(category);
        if (categorySet) {
            categorySet.delete(toolName);
        }
    }
    find(toolName) {
        return this.tools.get(toolName);
    }
    list() {
        return Array.from(this.tools.values());
    }
    resolve(toolName, category) {
        const tool = this.tools.get(toolName);
        if (tool && tool.definition.category === category) {
            return tool;
        }
        return undefined;
    }
    findByCategory(category) {
        const names = this.categories.get(category);
        if (!names)
            return [];
        const result = [];
        for (const name of names) {
            const tool = this.tools.get(name);
            if (tool)
                result.push(tool);
        }
        return result;
    }
    hasCapability(toolName, capability) {
        const tool = this.tools.get(toolName);
        if (!tool)
            return false;
        return !!tool.definition.capabilities[capability];
    }
}
//# sourceMappingURL=index.js.map