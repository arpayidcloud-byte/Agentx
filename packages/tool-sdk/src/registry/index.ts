import { IToolRegistry, ITool, ToolCategory, ToolCapability } from '../interfaces/index.js';
import { DuplicateToolError, ToolNotFoundError } from '../errors/index.js';

export class ToolRegistry implements IToolRegistry {
  private tools = new Map<string, ITool>();
  private categories = new Map<ToolCategory, Set<string>>();

  public register(tool: ITool): void {
    const name = tool.definition.name;
    if (this.tools.has(name)) {
      throw new DuplicateToolError(name);
    }

    this.tools.set(name, tool);

    const category = tool.definition.category;
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category)!.add(name);
  }

  public unregister(toolName: string): void {
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

  public find(toolName: string): ITool | undefined {
    return this.tools.get(toolName);
  }

  public list(): ITool[] {
    return Array.from(this.tools.values());
  }

  public resolve(toolName: string, category: ToolCategory): ITool | undefined {
    const tool = this.tools.get(toolName);
    if (tool && tool.definition.category === category) {
      return tool;
    }
    return undefined;
  }

  public findByCategory(category: ToolCategory): ITool[] {
    const names = this.categories.get(category);
    if (!names) return [];
    
    const result: ITool[] = [];
    for (const name of names) {
      const tool = this.tools.get(name);
      if (tool) result.push(tool);
    }
    return result;
  }

  public hasCapability(toolName: string, capability: keyof ToolCapability): boolean {
    const tool = this.tools.get(toolName);
    if (!tool) return false;
    return !!tool.definition.capabilities[capability];
  }
}
