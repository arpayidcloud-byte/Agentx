/// <reference types="node" resolution-mode="require"/>
import { SubAgentHeartbeat } from './interfaces.js';
import { EventEmitter } from 'events';
export declare class HeartbeatMonitor extends EventEmitter {
    private lastHeartbeats;
    private readonly timeoutMs;
    private intervalId?;
    constructor(timeoutMs?: number);
    recordHeartbeat(heartbeat: SubAgentHeartbeat): void;
    startMonitoring(checkIntervalMs?: number): void;
    stopMonitoring(): void;
    private checkHeartbeats;
    getStatus(agentId: string): SubAgentHeartbeat | undefined;
}
//# sourceMappingURL=heartbeat.d.ts.map