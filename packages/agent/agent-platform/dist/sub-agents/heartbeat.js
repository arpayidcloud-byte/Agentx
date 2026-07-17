import { AgentHeartbeatLostError } from './errors.js';
import { EventEmitter } from 'events';
export class HeartbeatMonitor extends EventEmitter {
    lastHeartbeats = new Map();
    timeoutMs;
    intervalId;
    constructor(timeoutMs = 30000) {
        super();
        this.timeoutMs = timeoutMs;
    }
    recordHeartbeat(heartbeat) {
        this.lastHeartbeats.set(heartbeat.agentId, heartbeat);
    }
    startMonitoring(checkIntervalMs = 5000) {
        this.intervalId = setInterval(() => {
            this.checkHeartbeats();
        }, checkIntervalMs);
    }
    stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
    checkHeartbeats() {
        const now = Date.now();
        for (const [agentId, heartbeat] of this.lastHeartbeats.entries()) {
            if (now - heartbeat.timestamp.getTime() > this.timeoutMs) {
                this.emit('heartbeat_lost', new AgentHeartbeatLostError(agentId));
                this.lastHeartbeats.delete(agentId); // Prevent repeated events
            }
        }
    }
    getStatus(agentId) {
        return this.lastHeartbeats.get(agentId);
    }
}
//# sourceMappingURL=heartbeat.js.map