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
  return JSON.parse(fs.readFileSync(tasksFile, 'utf-8')) as Record<
    string,
    {
      id: string;
      goal: string;
      status: string;
      graphId?: string;
      createdAt: string;
      updatedAt: string;
    }
  >;
}

export async function status(args: string[]): Promise<void> {
  const tasks = loadTasks();
  const id = args[0];

  if (!id) {
    const allTasks = Object.values(tasks);
    if (allTasks.length === 0) {
      console.log('No tasks found. Run "agentx submit <goal>" to create one.');
      return;
    }
    console.log('Tasks:');
    for (const t of allTasks) {
      const icon =
        t.status === 'COMPLETED'
          ? '✅'
          : t.status === 'FAILED'
            ? '❌'
            : t.status === 'RUNNING'
              ? '🔄'
              : '📋';
      console.log(
        `  ${icon} ${t.id.slice(0, 8)}... | ${t.status.padEnd(18)} | ${t.goal.slice(0, 50)}`,
      );
    }
    return;
  }

  const task = tasks[id] || Object.values(tasks).find((t) => t.id.startsWith(id));
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }

  console.log(`Task: ${task.id}`);
  console.log(`  Goal: ${task.goal}`);
  console.log(`  Status: ${task.status}`);
  if (task.graphId) console.log(`  Graph: ${task.graphId}`);
  console.log(`  Created: ${task.createdAt}`);
  console.log(`  Updated: ${task.updatedAt}`);
}
