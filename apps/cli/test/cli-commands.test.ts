import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { submit } from '../src/commands/submit.js';
import { status } from '../src/commands/status.js';
import { approve, reject } from '../src/commands/approve.js';
import { config } from '../src/commands/config.js';
import { plugin } from '../src/commands/plugin.js';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

function cleanData(): void {
  if (fs.existsSync(DATA_DIR)) {
    fs.rmSync(DATA_DIR, { recursive: true });
  }
}

describe('CLI submit', () => {
  beforeEach(cleanData);
  afterEach(cleanData);

  it('creates a task with goal', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await submit(['build', 'a', 'REST', 'API']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Task created'))).toBe(true);
    expect(logs.some((l) => l.includes('build a REST API'))).toBe(true);

    const tasks = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tasks.json'), 'utf-8'));
    expect(Object.keys(tasks)).toHaveLength(1);
    const task = Object.values(tasks)[0] as { goal: string; status: string };
    expect(task.goal).toBe('build a REST API');
    expect(task.status).toBe('CREATED');
  });

  it('throws when no goal provided', async () => {
    await expect(submit([])).rejects.toThrow('Usage: agentx submit');
  });
});

describe('CLI status', () => {
  beforeEach(cleanData);
  afterEach(cleanData);

  it('shows no tasks when empty', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await status([]);
    console.log = origLog;

    expect(logs.some((l) => l.includes('No tasks found'))).toBe(true);
  });

  it('shows task after submit', async () => {
    await submit(['test', 'goal']);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await status([]);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Tasks:'))).toBe(true);
    expect(logs.some((l) => l.includes('test goal'))).toBe(true);
  });
});

describe('CLI approve/reject', () => {
  beforeEach(cleanData);
  afterEach(cleanData);

  it('throws when task not in WAITING_APPROVAL', async () => {
    await submit(['test']);
    const tasks = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tasks.json'), 'utf-8'));
    const taskId = Object.keys(tasks)[0];
    await expect(approve([taskId])).rejects.toThrow('not waiting for approval');
  });
});

describe('CLI config', () => {
  beforeEach(cleanData);
  afterEach(cleanData);

  it('gets and sets config values', async () => {
    await config(['set', 'provider', 'anthropic']);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await config(['get', 'provider']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('anthropic'))).toBe(true);
  });

  it('shows all config when no key', async () => {
    await config(['set', 'a', '1']);
    await config(['set', 'b', '2']);
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await config(['get']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Configuration:'))).toBe(true);
  });
});

describe('CLI plugin', () => {
  beforeEach(cleanData);
  afterEach(cleanData);

  it('lists empty plugins', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await plugin(['list']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('No plugins'))).toBe(true);
  });

  it('installs a plugin', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    await plugin(['install', 'my-plugin']);
    console.log = origLog;

    expect(logs.some((l) => l.includes('Plugin installed: my-plugin'))).toBe(true);
    expect(logs.some((l) => l.includes('pending-review'))).toBe(true);
  });
});
