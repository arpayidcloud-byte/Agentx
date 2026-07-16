/**
 * @module provider-qualification/compatibility-validator
 * @description Ensures runtime and subsystem compatibility.
 */
import { CompatibilityValidationError } from './errors.js';
export class CompatibilityValidator {
    components = [
        'Runtime', 'WorkflowEngine', 'PlanningEngine', 'ContextEngine', 'MemoryEngine',
        'KnowledgeEngine', 'ApprovalEngine', 'ToolSDK', 'AgentPlatform', 'Coordinator',
        'Observability', 'Audit', 'Recovery', 'Supervisor', 'Registry'
    ];
    validate(componentList) {
        for (const comp of componentList) {
            if (!this.components.includes(comp)) {
                throw new CompatibilityValidationError(`Unsupported component compatibility: ${comp}`, 'compatibility-validator');
            }
        }
        return true;
    }
}
//# sourceMappingURL=compatibility-validator.js.map