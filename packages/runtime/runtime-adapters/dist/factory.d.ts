import type { IQueueProvider, ILockProvider } from './interfaces.js';
export interface AdapterConfig {
    type: 'memory' | 'redis';
    redisUrl?: string;
}
export declare function createQueueProvider(config: AdapterConfig): IQueueProvider;
export declare function createLockProvider(config: AdapterConfig): ILockProvider;
//# sourceMappingURL=factory.d.ts.map