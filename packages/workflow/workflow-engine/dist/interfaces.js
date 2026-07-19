/**
 * @module workflow-engine/interfaces
 * @description Core interfaces for the Workflow Engine.
 * Implements DAG execution, approval gates, and dependency scheduling.
 */
export class DefaultWorkflowPolicy {
    approvalNodeIds;
    approvalTimeoutMs;
    maxReroutes;
    constructor(opts) {
        this.approvalNodeIds = new Set(opts?.approvalNodeIds ?? []);
        this.approvalTimeoutMs = opts?.approvalTimeoutMs ?? 3600_000;
        this.maxReroutes = opts?.maxReroutes ?? 2;
    }
    requiresApprovalFor(nodeId, graph) {
        if (this.approvalNodeIds.has(nodeId))
            return true;
        const node = graph.nodes.find((n) => n.id === nodeId);
        return node?.type === 'approval';
    }
    getApprovalTimeout(_nodeId) {
        return this.approvalTimeoutMs;
    }
    getMaxReroutes(_nodeId) {
        return this.maxReroutes;
    }
}
//# sourceMappingURL=interfaces.js.map