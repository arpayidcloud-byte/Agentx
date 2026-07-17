/**
 * @module workflow-engine/graph
 * @description Graph models and utilities for workflow execution.
 */
/**
 * Creates a new workflow definition
 */
export function createWorkflow(id, name, createdBy, nodes = [], edges = []) {
    const now = new Date();
    return {
        id,
        name,
        version: 1,
        nodes,
        edges,
        variables: {},
        metadata: {
            createdAt: now,
            updatedAt: now,
            createdBy,
            traceId: `trace-${Date.now()}`,
        },
    };
}
/**
 * Creates a new workflow node
 */
export function createNode(id, type, name, config, options) {
    return {
        id,
        type,
        name,
        config,
        timeout: options?.timeout,
        retryPolicy: options?.retryPolicy,
    };
}
/**
 * Creates a new workflow edge
 */
export function createEdge(source, target, condition) {
    return { source, target, condition };
}
/**
 * Topological sort for DAG execution
 */
export function topologicalSort(nodes, edges) {
    const inDegree = new Map();
    const adjacency = new Map();
    for (const node of nodes) {
        inDegree.set(node.id, 0);
        adjacency.set(node.id, []);
    }
    for (const edge of edges) {
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        adjacency.get(edge.source)?.push(edge.target);
    }
    const queue = [];
    for (const [nodeId, degree] of inDegree.entries()) {
        if (degree === 0) {
            queue.push(nodeId);
        }
    }
    const sorted = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    while (queue.length > 0) {
        const current = queue.shift();
        const node = nodeMap.get(current);
        if (node)
            sorted.push(node);
        for (const neighbor of adjacency.get(current) || []) {
            const newDegree = (inDegree.get(neighbor) || 1) - 1;
            inDegree.set(neighbor, newDegree);
            if (newDegree === 0) {
                queue.push(neighbor);
            }
        }
    }
    if (sorted.length !== nodes.length) {
        throw new Error('Cycle detected in graph');
    }
    return sorted;
}
/**
 * Detects cycles in the graph
 */
export function detectCycle(nodes, edges) {
    const visited = new Set();
    const recursionStack = new Set();
    const adjacency = new Map();
    for (const node of nodes) {
        adjacency.set(node.id, []);
    }
    for (const edge of edges) {
        adjacency.get(edge.source)?.push(edge.target);
    }
    function dfs(nodeId) {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        for (const neighbor of adjacency.get(nodeId) || []) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor))
                    return true;
            }
            else if (recursionStack.has(neighbor)) {
                return true;
            }
        }
        recursionStack.delete(nodeId);
        return false;
    }
    for (const node of nodes) {
        if (!visited.has(node.id)) {
            if (dfs(node.id))
                return true;
        }
    }
    return false;
}
/**
 * Gets all predecessors of a node
 */
export function getPredecessors(nodeId, edges) {
    return edges
        .filter(e => e.target === nodeId)
        .map(e => e.source);
}
/**
 * Gets all successors of a node
 */
export function getSuccessors(nodeId, edges) {
    return edges
        .filter(e => e.source === nodeId)
        .map(e => e.target);
}
/**
 * Checks if a node is ready (all predecessors completed)
 */
export function isNodeReady(nodeId, edges, completedNodes) {
    const predecessors = getPredecessors(nodeId, edges);
    return predecessors.every(p => completedNodes.has(p));
}
/**
 * Finds all ready nodes
 */
export function findReadyNodes(nodes, edges, completedNodes, activeNodes) {
    return nodes.filter(n => !completedNodes.has(n.id) &&
        !activeNodes.has(n.id) &&
        isNodeReady(n.id, edges, completedNodes));
}
//# sourceMappingURL=graph.js.map