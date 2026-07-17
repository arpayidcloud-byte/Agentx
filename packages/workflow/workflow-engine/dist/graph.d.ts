/**
 * @module workflow-engine/graph
 * @description Graph models and utilities for workflow execution.
 */
import { WorkflowDefinition, WorkflowNode, WorkflowEdge } from './interfaces.js';
/** @description Node types in a workflow graph */
type NodeType = 'task' | 'approval' | 'conditional' | 'loop' | 'parallel' | 'tool' | 'agent' | 'retry';
/**
 * Creates a new workflow definition
 */
export declare function createWorkflow(id: string, name: string, createdBy: string, nodes?: WorkflowNode[], edges?: WorkflowEdge[]): WorkflowDefinition;
/**
 * Creates a new workflow node
 */
export declare function createNode(id: string, type: NodeType, name: string, config: any, options?: {
    timeout?: number;
    retryPolicy?: any;
}): WorkflowNode;
/**
 * Creates a new workflow edge
 */
export declare function createEdge(source: string, target: string, condition?: string): WorkflowEdge;
/**
 * Topological sort for DAG execution
 */
export declare function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[];
/**
 * Detects cycles in the graph
 */
export declare function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean;
/**
 * Gets all predecessors of a node
 */
export declare function getPredecessors(nodeId: string, edges: WorkflowEdge[]): string[];
/**
 * Gets all successors of a node
 */
export declare function getSuccessors(nodeId: string, edges: WorkflowEdge[]): string[];
/**
 * Checks if a node is ready (all predecessors completed)
 */
export declare function isNodeReady(nodeId: string, edges: WorkflowEdge[], completedNodes: Set<string>): boolean;
/**
 * Finds all ready nodes
 */
export declare function findReadyNodes(nodes: WorkflowNode[], edges: WorkflowEdge[], completedNodes: Set<string>, activeNodes: Set<string>): WorkflowNode[];
export {};
//# sourceMappingURL=graph.d.ts.map