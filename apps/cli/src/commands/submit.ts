import { randomUUID } from 'crypto';
import { getRuntime } from '../lib/runtime.js';
import { TaskStatus, TaskPriority } from '@agentx/core-runtime';

export async function submit(args: string[]): Promise<string> {
  const goal = args.join(' ');
  if (!goal) {
    throw new Error('Usage: agentx submit "<goal>"');
  }

  const { scheduler } = getRuntime();

  const taskId = randomUUID();
  const graphId = `graph-${randomUUID().slice(0, 8)}`;
  const now = new Date();

  const task = {
    id: taskId,
    goal,
    status: TaskStatus.CREATED,
    priority: TaskPriority.NORMAL,
    rootTaskId: taskId,
    dependsOn: [],
    traceId: graphId,
    metadata: {
      retryCount: 0,
    },
    context: {
      variables: {},
      history: [],
    },
    createdAt: now,
    updatedAt: now,
  };

  await scheduler.enqueue(task);

  console.log(`Task created: ${taskId}`);
  console.log(`  Goal: ${goal}`);
  console.log(`  Graph: ${graphId}`);
  console.log(`  Status: ${TaskStatus.CREATED}`);
  console.log(`\nRun "agentx status ${taskId}" to check progress.`);
  console.log(`Run "agentx watch ${graphId}" to stream execution.`);

  return taskId;
}
