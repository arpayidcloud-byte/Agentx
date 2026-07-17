import { AgentMessage } from './interfaces.js';
import { IEventBus } from '@agentx/core-runtime';
export declare class MessageBus {
    private globalEventBus;
    private handlers;
    constructor(globalEventBus: IEventBus);
    subscribe(topic: AgentMessage['topic'], handler: (msg: AgentMessage) => void): void;
    publish(message: AgentMessage): void;
    broadcastToGlobalBus(message: AgentMessage): Promise<void>;
}
//# sourceMappingURL=message-bus.d.ts.map