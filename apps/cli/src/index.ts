// V9 CLI - Human Interface
import { Command } from 'commander';

const program = new Command();

program.name('agentx').description('AgentX CLI').version('0.1.0');

program
  .command('run <goal>')
  .description('Run a task')
  .action(async (goal: string) => {
    console.log(`Running: ${goal}`);
  });

export { program };
