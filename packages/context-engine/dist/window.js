export class ContextWindowManager {
    estimator;
    constructor(estimator) {
        this.estimator = estimator;
    }
    trim(data, maxTokens) {
        const tokens = this.estimator.estimate(data);
        if (tokens <= maxTokens)
            return { ...data };
        const result = {};
        let currentTokens = 0;
        // Simple trim: keep scalar values, drop large objects/arrays if they exceed budget
        for (const [key, value] of Object.entries(data)) {
            const itemTokens = this.estimator.estimate({ [key]: value });
            if (currentTokens + itemTokens <= maxTokens) {
                result[key] = value;
                currentTokens += itemTokens;
            }
        }
        return result;
    }
    slideWindow(history, maxTokens) {
        const result = [];
        let currentTokens = 0;
        // Keep most recent items (end of array)
        for (let i = history.length - 1; i >= 0; i--) {
            const itemTokens = this.estimator.estimate(history[i]);
            if (currentTokens + itemTokens <= maxTokens) {
                result.unshift(history[i]);
                currentTokens += itemTokens;
            }
            else {
                break;
            }
        }
        return result;
    }
}
//# sourceMappingURL=window.js.map