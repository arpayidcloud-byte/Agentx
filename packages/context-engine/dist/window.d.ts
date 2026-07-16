import { IContextWindowManager, ITokenEstimator } from './interfaces.js';
export declare class ContextWindowManager implements IContextWindowManager {
    private estimator;
    constructor(estimator: ITokenEstimator);
    trim(data: Record<string, unknown>, maxTokens: number): Record<string, unknown>;
    slideWindow(history: unknown[], maxTokens: number): unknown[];
}
//# sourceMappingURL=window.d.ts.map