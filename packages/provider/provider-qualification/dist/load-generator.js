/**
 * @module provider-qualification/load-generator
 * @description Injects artificial load.
 */
export class LoadGenerator {
    generate(_rateRps, durationMs) {
        return new Promise((resolve) => {
            setTimeout(resolve, durationMs); // Simulated
        });
    }
}
//# sourceMappingURL=load-generator.js.map