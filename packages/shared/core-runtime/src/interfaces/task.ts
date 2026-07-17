export type TaskId = string;

export enum TaskStatus {
  CREATED = 'CREATED',
  QUEUED = 'QUEUED',
  DECOMPOSING = 'DECOMPOSING',
  PLANNING = 'PLANNING',
  RUNNING = 'RUNNING',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  WAITING_PROVIDER = 'WAITING_PROVIDER',
  WAITING_TOOL = 'WAITING_TOOL',
  RETRYING = 'RETRYING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export interface TaskMetadata {
  retryCount: number;
  providerId?: string;
  toolName?: string;
  [key: string]: unknown;
}

export interface TaskContext {
  variables: Record<string, unknown>;
  history: Array<{ role: string; content: unknown }>;
}

export interface TaskResult {
  output: unknown;
  metadata?: Record<string, unknown>;
}

export interface TaskError {
  code: string;
  message: string;
  stack?: string;
  isRetryable: boolean;
}

export interface TaskCancellation {
  reason: string;
  requestedBy: string;
  timestamp: Date;
}

export interface TaskModel {
  id: TaskId;
  goal: string;
  status: TaskStatus;
  priority: TaskPriority;
  parentTaskId?: TaskId;
  rootTaskId: TaskId;
  assignedAgentRole?: string;
  dependsOn: TaskId[];
  traceId: string;
  metadata: TaskMetadata;
  context: TaskContext;
  result?: TaskResult;
  error?: TaskError;
  cancellation?: TaskCancellation;
  createdAt: Date;
  updatedAt: Date;
}
