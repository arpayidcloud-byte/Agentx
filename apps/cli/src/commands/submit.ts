import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

interface TaskRecord {
  id: string;
  goal: string;
  status: 'CREATED' | 'PLANNING' | 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  graphId?: string;
  createdAt: string;
  updatedAt: string;
}

function saveTask(task: TaskRecord): void {
  ensureDataDir();
  const tasksFile = path.join(DATA_DIR, 'tasks.json');
  const tasks = loadTasks();
  tasks[task.id] = task;
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

function loadTasks(): Record<string, TaskRecord> {
  const tasksFile = path.join(DATA_DIR, 'tasks.json');
  if (!fs.existsSync(tasksFile)) return {};
  return JSON.parse(fs.readFileSync(tasksFile, 'utf-8')) as Record<string, TaskRecord>;
}

export async function submit(args: string[]): Promise<void> {
  const goal = args.join(' ');
  if (!goal) {
    throw new Error('Usage: agentx submit "<goal>"');
  }

  const taskId = randomUUID();
  const graphId = `graph-${randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  const task: TaskRecord = {
    id: taskId,
    goal,
    status: 'CREATED',
    graphId,
    createdAt: now,
    updatedAt: now,
  };

  saveTask(task);

  console.log(`Task created: ${taskId}`);
  console.log(`  Goal: ${goal}`);
  console.log(`  Graph: ${graphId}`);
  console.log(`  Status: CREATED`);
  console.log(`\nRun "agentx status ${taskId}" to check progress.`);
  console.log(`Run "agentx watch ${graphId}" to stream execution.`);
}
