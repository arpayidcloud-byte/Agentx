/**
 * @module runtime/runtime-health-v2
 * @description Enhanced health check service for all runtime components.
 */
export class RuntimeHealthService {
    checks = new Map();
    startTime = Date.now();
    lastResults = new Map();
    registerCheck(component, checkFn) {
        this.checks.set(component, checkFn);
    }
    async checkComponent(component) {
        const checkFn = this.checks.get(component);
        if (!checkFn) {
            return {
                component,
                healthy: false,
                latencyMs: 0,
                lastChecked: new Date(),
                error: 'Component not registered',
            };
        }
        const result = await checkFn();
        this.lastResults.set(component, result);
        return result;
    }
    async checkAll() {
        const components = [];
        for (const [component] of this.checks) {
            components.push(await this.checkComponent(component));
        }
        return {
            overall: components.every((c) => c.healthy),
            components,
            timestamp: new Date(),
            uptimeMs: Date.now() - this.startTime,
        };
    }
    getLastResults() {
        return new Map(this.lastResults);
    }
}
//# sourceMappingURL=runtime-health-v2.js.map