/**
 * @module workflow-engine/timeline
 * @description Execution timeline generation for deterministic tracking.
 */
export class ExecutionTimeline {
    entries = [];
    startNode(node) {
        this.entries.push({
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.config.type,
            startedAt: new Date(),
            finishedAt: null,
            durationMs: 0,
            retries: 0,
            status: 'RUNNING',
        });
    }
    finishNode(nodeId, status, retries = 0) {
        const entry = this.entries.find((e) => e.nodeId === nodeId && !e.finishedAt);
        if (entry) {
            entry.finishedAt = new Date();
            entry.durationMs = entry.finishedAt.getTime() - entry.startedAt.getTime();
            entry.status = status;
            entry.retries = retries;
        }
    }
    getTimeline() {
        return [...this.entries].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
    }
    getDuration() {
        if (this.entries.length === 0)
            return 0;
        const sorted = this.getTimeline();
        if (sorted.length === 0)
            return 0;
        const lastFinished = sorted.find((e) => e.finishedAt);
        return lastFinished?.finishedAt?.getTime() ?? 0;
    }
    clear() {
        this.entries = [];
    }
}
//# sourceMappingURL=timeline.js.map