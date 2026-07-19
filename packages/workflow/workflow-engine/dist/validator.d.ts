/**
 * @module workflow-engine/validator
 * @description Workflow validation and graph integrity checks.
 */
import type { WorkflowDefinition, WorkflowNode, WorkflowEdge } from './interfaces.js';
/**
 * Validates a workflow definition
 */
export declare function validateWorkflow(workflow: WorkflowDefinition): void;
/**
 * Validates node configuration
 */
export declare function validateNodeConfig(node: WorkflowNode): void;
/**
 * Validates edge configuration
 */
export declare function validateEdges(edges: WorkflowEdge[], nodeIds: Set<string>): void;
//# sourceMappingURL=validator.d.ts.map