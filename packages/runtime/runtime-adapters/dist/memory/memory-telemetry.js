/**
 * @module runtime-adapters/memory/memory-telemetry
 * @description Reference in-memory telemetry, metrics, and tracing provider.
 */
export class MemoryTelemetryProvider {
    spans = new Map();
    metrics = new Map();
    histograms = new Map();
    total = 0;
    getMetadata() {
        return {
            id: 'memory-telemetry',
            name: 'Memory Telemetry Provider',
            type: 'telemetry',
            version: '0.1.0',
        };
    }
    getCapabilities() {
        return { telemetry: true };
    }
    async healthCheck() {
        return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
    }
    getMetrics() {
        return { totalRequests: this.total, successfulRequests: this.total, failedRequests: 0, averageLatencyMs: 0 };
    }
    startSpan(name, context) {
        this.total++;
        const spanId = `span-${Date.now()}-${Math.random()}`;
        this.spans.set(spanId, { id: spanId, name, context });
        return spanId;
    }
    endSpan(spanId, status = 'OK') {
        const span = this.spans.get(spanId);
        if (span) {
            span.status = status;
        }
    }
    recordCounter(name, value = 1) {
        this.metrics.set(name, (this.metrics.get(name) || 0) + value);
    }
    recordHistogram(name, value) {
        const list = this.histograms.get(name) || [];
        list.push(value);
        this.histograms.set(name, list);
    }
    recordGauge(name, value) {
        this.metrics.set(name, value);
    }
    async flush() {
        // telemetries flushed
    }
    getSpans() {
        return this.spans;
    }
    getGauges() {
        return this.metrics;
    }
}
//# sourceMappingURL=memory-telemetry.js.map