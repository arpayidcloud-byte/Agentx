export class KnowledgeEngine {
    store;
    eventBus;
    metrics = {
        totalDocuments: 0,
        totalNodes: 0,
        totalRelations: 0,
        averageConfidence: 0
    };
    constructor(store, eventBus) {
        this.store = store;
        this.eventBus = eventBus;
    }
    async ingest(data) {
        const now = new Date();
        const doc = {
            id: `doc_${Math.random().toString(36).substring(2, 9)}`,
            content: data.content || '',
            metadata: data.metadata || {},
            tags: data.tags || [],
            version: 1,
            sourceUri: data.sourceUri,
            createdAt: now,
            updatedAt: now
        };
        await this.store.saveDocument(doc);
        // Auto-create a node for the document (simple chunking logic: 1 doc = 1 node for foundation)
        const node = {
            id: `node_${doc.id}`,
            documentId: doc.id,
            content: doc.content,
            metadata: doc.metadata,
            confidenceScore: 1.0,
            createdAt: now
        };
        await this.store.saveNode(node);
        await this.updateMetrics();
        await this.eventBus.publish('knowledge.ingested', doc, `trace_${doc.id}`);
        return doc;
    }
    async retrieve(query) {
        let results = await this.store.searchNodes(query.text, query.limit);
        if (query.minConfidence !== undefined) {
            results = results.filter(n => n.confidenceScore >= query.minConfidence);
        }
        return results;
    }
    async update(documentId, updates) {
        const existing = await this.store.getDocument(documentId);
        if (!existing)
            throw new Error(`Document ${documentId} not found`);
        const doc = {
            ...existing,
            ...updates,
            version: existing.version + 1,
            updatedAt: new Date()
        };
        await this.store.saveDocument(doc);
        // Update corresponding node
        const node = await this.store.getNode(`node_${doc.id}`);
        if (node) {
            await this.store.saveNode({
                ...node,
                content: doc.content,
                metadata: doc.metadata
            });
        }
        await this.eventBus.publish('knowledge.updated', doc, `trace_${doc.id}`);
        return doc;
    }
    async delete(documentId) {
        await this.store.deleteDocument(documentId);
        await this.updateMetrics();
        await this.eventBus.publish('knowledge.deleted', { id: documentId }, `trace_${documentId}`);
    }
    async createRelationship(sourceId, targetId, type, metadata) {
        const relation = {
            id: `rel_${Math.random().toString(36).substring(2, 9)}`,
            sourceId,
            targetId,
            type,
            weight: 1.0,
            metadata: metadata || {},
            createdAt: new Date()
        };
        await this.store.saveRelation(relation);
        await this.updateMetrics();
        return relation;
    }
    async traverse(startNodeId, maxDepth = 1) {
        const nodes = new Map();
        const relations = [];
        const startNode = await this.store.getNode(startNodeId);
        if (!startNode)
            return { nodes: [], relations: [] };
        nodes.set(startNode.id, startNode);
        // Simple 1-level traversal for foundation
        if (maxDepth >= 1) {
            const rels = await this.store.getRelations(startNodeId);
            for (const rel of rels) {
                relations.push(rel);
                const targetNode = await this.store.getNode(rel.targetId);
                if (targetNode && !nodes.has(targetNode.id)) {
                    nodes.set(targetNode.id, targetNode);
                }
            }
        }
        return {
            nodes: Array.from(nodes.values()),
            relations
        };
    }
    getMetrics() {
        return { ...this.metrics };
    }
    async updateMetrics() {
        const docs = await this.store.listDocuments();
        this.metrics.totalDocuments = docs.length;
        // Mock metric updates for nodes/relations based on docs length
        this.metrics.totalNodes = docs.length;
        this.metrics.totalRelations = docs.length > 1 ? docs.length - 1 : 0;
        this.metrics.averageConfidence = docs.length > 0 ? 1.0 : 0;
    }
}
export class InMemoryKnowledgeStore {
    documents = new Map();
    nodes = new Map();
    relations = new Map();
    async saveDocument(doc) {
        this.documents.set(doc.id, doc);
    }
    async getDocument(id) {
        return this.documents.get(id);
    }
    async deleteDocument(id) {
        this.documents.delete(id);
        this.nodes.delete(`node_${id}`);
    }
    async listDocuments() {
        return Array.from(this.documents.values());
    }
    async saveNode(node) {
        this.nodes.set(node.id, node);
    }
    async getNode(id) {
        return this.nodes.get(id);
    }
    async searchNodes(query, limit) {
        let results = Array.from(this.nodes.values());
        if (query) {
            results = results.filter(n => n.content.includes(query));
        }
        if (limit) {
            results = results.slice(0, limit);
        }
        return results;
    }
    async saveRelation(relation) {
        const existing = this.relations.get(relation.sourceId) || [];
        existing.push(relation);
        this.relations.set(relation.sourceId, existing);
    }
    async getRelations(nodeId) {
        return this.relations.get(nodeId) || [];
    }
}
//# sourceMappingURL=engine.js.map