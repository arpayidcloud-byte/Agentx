/**
 * @module provider-qualification/fault-injector
 * @description Simulates specific component faults.
 */
export class FaultInjector {
    injectCrash() {
        // simulated crash
    }
    injectDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    injectDisconnect() {
        // simulated disconnect
    }
}
//# sourceMappingURL=fault-injector.js.map