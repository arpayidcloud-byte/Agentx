/**
 * @module workflow-engine/serializer
 * @description Workflow serialization/deserialization for persistence.
 */
import { WorkflowDefinition, IWorkflowSerializer } from './interfaces.js';
/**
 * JSON serializer for workflow definitions
 */
export declare class JsonWorkflowSerializer implements IWorkflowSerializer {
    /** @inheritdoc */
    serialize(definition: WorkflowDefinition): string;
    /** @inheritdoc */
    deserialize(data: string): WorkflowDefinition;
}
//# sourceMappingURL=serializer.d.ts.map