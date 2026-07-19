/**
 * @module workflow-engine/critical-path
 * @description CriticalPathAnalyzer for identifying bottlenecks and parallel efficiency.
 */
import { topologicalSort } from './graph.js';
export class CriticalPathAnalyzer {
    analyze(workflow) {
        const longestChain = this.findLongestChain(workflow);
        const parallelEfficiency = this.calculateParallelEfficiency(workflow);
        const bottlenecks = this.findBottlenecks(workflow);
        const idleTime = this.calculateIdleTime(workflow, longestChain.length);
        return {
            workflowId: workflow.id,
            longestChain,
            longestChainLength: longestChain.length,
            parallelEfficiency,
            estimatedBottlenecks: bottlenecks,
            idleTime,
        };
    }
    findLongestChain(workflow) {
        const sorted = topologicalSort(workflow.nodes, workflow.edges);
        return sorted.map((n) => n.id);
    }
    calculateParallelEfficiency(workflow) {
        const sorted = topologicalSort(workflow.nodes, workflow.edges);
        if (sorted.length === 0)
            return 0;
        const inDegree = new Map();
        for (const node of workflow.nodes) {
            inDegree.set(node.id, 0);
        }
        for (const edge of workflow.edges) {
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        }
        const zeroDegreeCount = Array.from(inDegree.values()).filter((d) => d === 0).length;
        return Math.min(1, zeroDegreeCount / sorted.length);
    }
    findBottlenecks(workflow) {
        const bottlenecks = [];
        const outDegree = new Map();
        for (const node of workflow.nodes) {
            outDegree.set(node.id, 0);
        }
        for (const edge of workflow.edges) {
            outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
        }
        const maxOut = Math.max(...Array.from(outDegree.values()));
        for (const [nodeId, degree] of outDegree.entries()) {
            if (degree === maxOut && maxOut > 1) {
                bottlenecks.push(nodeId);
            }
        }
        return bottlenecks;
    }
    calculateIdleTime(workflow, chainLength) {
        return Math.max(0, (workflow.nodes.length - chainLength) * 500);
    }
}
//# sourceMappingURL=critical-path.js.map