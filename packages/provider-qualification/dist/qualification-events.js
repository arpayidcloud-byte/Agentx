/**
 * @module provider-qualification/qualification-events
 * @description Event emitter and payload builder.
 */
export class QualificationEventEmitter {
    events = [];
    emit(type, payload = {}) {
        this.events.push({
            type,
            timestamp: new Date(),
            payload,
        });
    }
    getEvents() {
        return [...this.events];
    }
    clear() {
        this.events = [];
    }
}
//# sourceMappingURL=qualification-events.js.map