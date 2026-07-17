/**
 * @module provider-qualification/qualification-engine
 * @description Master orchestration engine for Provider Qualification Framework.
 */
import { IProvider } from '@agentx/runtime-adapters';
import { CertificationReport } from './interfaces.js';
import { QualificationMetricsCollector } from './qualification-metrics.js';
import { QualificationAuditLogger } from './qualification-audit.js';
import { QualificationEventEmitter } from './qualification-events.js';
import { SnapshotManager } from './snapshot.js';
import { QualificationRegistry } from './qualification-registry.js';
export declare class QualificationEngine {
    metrics: QualificationMetricsCollector;
    audit: QualificationAuditLogger;
    events: QualificationEventEmitter;
    snapshotManager: SnapshotManager;
    registry: QualificationRegistry;
    private contractValidator;
    private compatibilityValidator;
    private benchmarkEngine;
    private stressEngine;
    private chaosEngine;
    private scoreCalculator;
    private ranking;
    qualify(provider: IProvider, requiredMethods: string[]): Promise<CertificationReport>;
}
//# sourceMappingURL=qualification-engine.d.ts.map