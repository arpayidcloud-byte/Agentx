import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

function loadTasks(): Record<
  string,
  {
    id: string;
    goal: string;
    status: string;
    graphId?: string;
    createdAt: string;
    updatedAt: string;
  }
> {
  const tasksFile = path.join(DATA_DIR, 'tasks.json');
  if (!fs.existsSync(tasksFile)) return {};
  return JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
}

function saveTasks(tasks: Record<string, unknown>): void {
  fs.writeFileSync(path.join(DATA_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2));
}

export async function approve(args: string[]): Promise<void> {
  const taskId = args[0];
  if (!taskId) throw new Error('Usage: agentx approve <taskId>');

  const tasks = loadTasks();
  const task = tasks[taskId] || Object.entries(tasks).find(([_, t]) => t.id.startsWith(taskId));

  if (!task) throw new Error(`Task not found: ${taskId}`);

  const t = Array.isArray(task) ? task[1] : task;
  if (t.status !== 'WAITING_APPROVAL') {
    throw new Error(`Task ${t.id} is not waiting for approval (status: ${t.status})`);
  }

  t.status = 'RUNNING';
  t.updatedAt = new Date().toISOString();
  saveTasks(tasks);

  console.log(`✅ Approved task ${t.id}`);
  console.log(`  Status: RUNNING`);
}

export async function reject(args: string[]): Promise<void> {
  const taskId = args[0];
  if (!taskId) throw new Error('Usage: agentx reject <taskId>');

  const tasks = loadTasks();
  const task = tasks[taskId] || Object.entries(tasks).find(([_, t]) => t.id.startsWith(taskId));

  if (!task) throw new Error(`Task not found: ${taskId}`);

  const t = Array.isArray(task) ? task[1] : task;
  if (t.status !== 'WAITING_APPROVAL') {
    throw new Error(`Task ${t.id} is not waiting for approval (status: ${t.status})`);
  }

  t.status = 'FAILED';
  t.updatedAt = new Date().toISOString();
  saveTasks(tasks);

  console.log(`❌ Rejected task ${t.id}`);
  console.log(`  Status: FAILED`);
}
