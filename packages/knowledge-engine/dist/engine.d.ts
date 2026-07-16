import { IKnowledgeEngine, IKnowledgeStore, KnowledgeDocument, KnowledgeQuery, KnowledgeNode, KnowledgeRelation, KnowledgeGraph, KnowledgeMetrics } from './interfaces.js';
import { IEventBus } from '@agentx/core-runtime';
export declare class KnowledgeEngine implements IKnowledgeEngine {
    private store;
    private eventBus;
    private metrics;
    constructor(store: IKnowledgeStore, eventBus: IEventBus);
    ingest(data: Partial<KnowledgeDocument>): Promise<KnowledgeDocument>;
    retrieve(query: KnowledgeQuery): Promise<KnowledgeNode[]>;
    update(documentId: string, updates: Partial<KnowledgeDocument>): Promise<KnowledgeDocument>;
    delete(documentId: string): Promise<void>;
    createRelationship(sourceId: string, targetId: string, type: string, metadata?: Record<string, unknown>): Promise<KnowledgeRelation>;
    traverse(startNodeId: string, maxDepth?: number): Promise<KnowledgeGraph>;
    getMetrics(): KnowledgeMetrics;
    private updateMetrics;
}
export declare class InMemoryKnowledgeStore implements IKnowledgeStore {
    private documents;
    private nodes;
    private relations;
    saveDocument(doc: KnowledgeDocument): Promise<void>;
    getDocument(id: string): Promise<KnowledgeDocument | undefined>;
    deleteDocument(id: string): Promise<void>;
    listDocuments(): Promise<KnowledgeDocument[]>;
    saveNode(node: KnowledgeNode): Promise<void>;
    getNode(id: string): Promise<KnowledgeNode | undefined>;
    searchNodes(query: string, limit?: number): Promise<KnowledgeNode[]>;
    saveRelation(relation: KnowledgeRelation): Promise<void>;
    getRelations(nodeId: string): Promise<KnowledgeRelation[]>;
}
//# sourceMappingURL=engine.d.ts.map