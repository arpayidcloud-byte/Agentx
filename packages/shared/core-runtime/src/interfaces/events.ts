import type { TaskId } from './task.js';

export interface EventEnvelope<T = unknown> {
  id: string; // for idempotency/dedupe
  topic: string;
  traceId: string;
  taskId?: TaskId;
  timestamp: Date;
  version: string;
  sourceModule: string;
  payload: T;
  metadata?: Record<string, unknown>;
}

export enum EventTopic {
  TASK_CREATED = 'task.created',
  TASK_QUEUED = 'task.queued',
  TASK_STARTED = 'task.started',
  TASK_STATE_CHANGED = 'task.state_changed',
  TASK_RETRYING = 'task.retrying',
  TASK_WAITING_APPROVAL = 'task.waiting_approval',
  TASK_APPROVAL_REQUIRED = 'task.approval_required',
  TASK_APPROVAL_RESOLVED = 'task.approval_resolved',
  TASK_WAITING_PROVIDER = 'task.waiting_provider',
  TASK_WAITING_TOOL = 'task.waiting_tool',
  TASK_COMPLETED = 'task.completed',
  TASK_FAILED = 'task.failed',
  TASK_CANCELLED = 'task.cancelled',

  TOOL_INVOKED = 'tool.invoked',
  PROVIDER_CALL_COMPLETED = 'provider.call_completed',
}

export interface IEventBus {
  publish<T>(
    topic: string,
    payload: T,
    traceId: string,
    taskId?: TaskId,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
  subscribe<T>(topic: string, handler: (event: EventEnvelope<T>) => Promise<void>): Promise<void>;
  unsubscribe(topic: string): Promise<void>;

  // Advanced routing
  request<TReq, TRes>(
    topic: string,
    payload: TReq,
    traceId: string,
    timeoutMs?: number,
  ): Promise<EventEnvelope<TRes>>;
  reply<TReq, TRes>(
    topic: string,
    handler: (event: EventEnvelope<TReq>) => Promise<TRes>,
  ): Promise<void>;
  broadcast<T>(topic: string, payload: T, traceId: string): Promise<void>;
}
