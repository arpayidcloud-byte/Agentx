/**
 * @module shell/audit
 * @description Audit event emitter for shell execution.
 * Implements audit trail for tool.invoked, tool.finished, tool.failed events.
 * Follows Volume 2 Event Bus patterns and Volume 13 Observability requirements.
 */
/**
 * In-memory audit emitter for shell execution events
 */
export class ShellAuditEmitter {
    events = [];
    /**
     * Emit an audit event
     * @param event - The audit event to emit
     */
    emit(event) {
        this.events.push({
            ...event,
            timestamp: event.timestamp || new Date(),
        });
    }
    /**
     * Get all emitted events
     * @returns Array of audit events
     */
    getEvents() {
        return [...this.events];
    }
    /**
     * Get events filtered by type
     * @param eventType - The event type to filter
     * @returns Filtered audit events
     */
    getEventsByType(eventType) {
        return this.events.filter((e) => e.eventType === eventType);
    }
    /**
     * Get events for a specific task
     * @param taskId - The task ID to filter
     * @returns Filtered audit events
     */
    getEventsByTask(taskId) {
        return this.events.filter((e) => e.taskId === taskId);
    }
    /**
     * Clear all events
     */
    clear() {
        this.events = [];
    }
}
/**
 * Creates a shell invoked audit event
 */
export function createToolInvokedEvent(command, category, taskId, traceId, agentRole) {
    return {
        eventType: 'tool.invoked',
        category,
        command,
        allowed: true,
        taskId,
        traceId,
        agentRole,
        timestamp: new Date(),
    };
}
/**
 * Creates a shell finished audit event
 */
export function createToolFinishedEvent(command, category, exitCode, durationMs, stdoutLength, stderrLength, taskId, traceId, agentRole, timedOut = false) {
    return {
        eventType: 'tool.finished',
        category,
        command,
        exitCode,
        durationMs,
        stdoutLength,
        stderrLength,
        allowed: true,
        timedOut,
        taskId,
        traceId,
        agentRole,
        timestamp: new Date(),
    };
}
/**
 * Creates a shell failed audit event
 */
export function createToolFailedEvent(command, category, taskId, traceId, agentRole, _reason) {
    return {
        eventType: 'tool.failed',
        category,
        command,
        allowed: false,
        taskId,
        traceId,
        agentRole,
        timestamp: new Date(),
    };
}
//# sourceMappingURL=audit.js.map