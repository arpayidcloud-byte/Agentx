/**
 * @module provider-qualification/fault-injector
 * @description Simulates specific component faults.
 */
export declare class FaultInjector {
    injectCrash(): void;
    injectDelay(ms: number): Promise<void>;
    injectDisconnect(): void;
}
//# sourceMappingURL=fault-injector.d.ts.map