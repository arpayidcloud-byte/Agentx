/**
 * @module workflow-engine/serializer
 * @description Workflow serialization/deserialization for persistence.
 */
/**
 * JSON serializer for workflow definitions
 */
export class JsonWorkflowSerializer {
    /** @inheritdoc */
    serialize(definition) {
        return JSON.stringify(definition, null, 2);
    }
    /** @inheritdoc */
    deserialize(data) {
        try {
            const parsed = JSON.parse(data);
            if (!parsed.id || !parsed.name || !parsed.nodes || !parsed.edges) {
                throw new Error('Invalid workflow definition');
            }
            return parsed;
        }
        catch (e) {
            throw new Error(`Failed to deserialize workflow: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
}
//# sourceMappingURL=serializer.js.map