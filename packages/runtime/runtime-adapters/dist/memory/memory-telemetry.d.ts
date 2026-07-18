/**
 * @module runtime-adapters/memory/memory-telemetry
 * @description Reference in-memory telemetry, metrics, and tracing provider.
 */
import type { ITelemetryProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics, ProviderContext } from '../interfaces.js';
export interface TelemetrySpanRecord {
    id: string;
    name: string;
    context?: ProviderContext;
    status?: 'OK' | 'ERROR';
}
export declare class MemoryTelemetryProvider implements ITelemetryProvider {
    private spans;
    private metrics;
    private histograms;
    private total;
    getMetadata(): ProviderMetadata;
    getCapabilities(): ProviderCapabilities;
    healthCheck(): Promise<ProviderHealth>;
    getMetrics(): ProviderMetrics;
    startSpan(name: string, context?: ProviderContext): string;
    endSpan(spanId: string, status?: 'OK' | 'ERROR'): void;
    recordCounter(name: string, value?: number): void;
    recordHistogram(name: string, value: number): void;
    recordGauge(name: string, value: number): void;
    flush(): Promise<void>;
    getSpans(): Map<string, TelemetrySpanRecord>;
    getGauges(): Map<string, number>;
}
//# sourceMappingURL=memory-telemetry.d.ts.map