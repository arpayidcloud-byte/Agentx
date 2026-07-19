#!/usr/bin/env node

import { submit } from './commands/submit.js';
import { status } from './commands/status.js';
import { watch } from './commands/watch.js';
import { approve, reject } from './commands/approve.js';
import { cost } from './commands/cost.js';
import { audit } from './commands/audit.js';
import { plugin } from './commands/plugin.js';
import { config } from './commands/config.js';

const COMMANDS: Record<string, (args: string[]) => Promise<void>> = {
  submit,
  status,
  watch,
  approve,
  reject,
  cost,
  audit,
  plugin,
  config,
};

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === 'help' || command === '--help') {
    printHelp();
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    console.log('agentx v0.1.0');
    process.exit(0);
  }

  const handler = COMMANDS[command];
  if (!handler) {
    console.error(`Unknown command: ${command}`);
    console.error('Run "agentx help" for available commands.');
    process.exit(1);
  }

  try {
    await handler(args);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
agentx — AI Engineering Platform CLI (v0.1.0)

Usage: agentx <command> [options]

Commands:
  submit "<goal>"           Create a task and trigger decomposition
  status [taskId|graphId]   Show current state machine position
  watch [graphId]           Live-stream state transitions via Event Bus
  approve <taskId>          Approve a pending approval gate
  reject <taskId>           Reject a pending approval gate
  cost [graphId]            Show cost aggregation for a task graph
  audit [graphId]           Show audit event trail
  plugin <subcommand>       Plugin lifecycle (install|enable|disable|list)
  config <get|set> [key]    Read/write local configuration

Options:
  --help, -h               Show this help message
  --version, -v            Show version
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
