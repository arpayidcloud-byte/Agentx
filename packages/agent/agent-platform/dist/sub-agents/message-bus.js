export class MessageBus {
    globalEventBus;
    handlers = new Map();
    constructor(globalEventBus) {
        this.globalEventBus = globalEventBus;
    }
    subscribe(topic, handler) {
        if (!this.handlers.has(topic)) {
            this.handlers.set(topic, new Set());
        }
        this.handlers.get(topic).add(handler);
    }
    publish(message) {
        const topicHandlers = this.handlers.get(message.topic);
        if (topicHandlers) {
            for (const handler of topicHandlers) {
                handler(message);
            }
        }
    }
    async broadcastToGlobalBus(message) {
        await this.globalEventBus.publish(`agent.${message.topic}`, message, 'trace-bus');
    }
}
//# sourceMappingURL=message-bus.js.map