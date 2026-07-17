/**
 * @module provider-qualification/qualification-events
 * @description Event emitter and payload builder.
 */
export interface QualificationEvent {
    type: string;
    timestamp: Date;
    payload: Record<string, unknown>;
}
export declare class QualificationEventEmitter {
    private events;
    emit(type: string, payload?: Record<string, unknown>): void;
    getEvents(): QualificationEvent[];
    clear(): void;
}
//# sourceMappingURL=qualification-events.d.ts.map