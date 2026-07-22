import { getRuntime } from '../lib/runtime.js';

export async function status(args: string[]): Promise<void> {
  const taskId = args[0];
  const { scheduler } = getRuntime();

  if (!taskId) {
    console.log('Usage: agentx status <task-id>');
    return;
  }

  const task = await scheduler.getTask(taskId);
  if (!task) {
    console.error(`Task ${taskId} not found`);
    process.exit(1);
  }

  console.log(`Task: ${task.id}`);
  console.log(`Status: ${task.status}`);
  console.log(`Goal: ${task.goal}`);
}
