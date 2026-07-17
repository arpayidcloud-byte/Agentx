export declare class MergeEngine {
    merge(outputs: unknown[]): Record<string, unknown>;
}
export declare class ConflictResolver {
    resolveConflict(_key: string, val1: unknown, val2: unknown, criteria: {
        architectOverride?: boolean;
        coverageScore1?: number;
        coverageScore2?: number;
    }): unknown;
}
//# sourceMappingURL=merge-engine.d.ts.map