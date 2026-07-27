# AgentX Platform

> Provider-agnostic, multi-agent AI software-engineering platform.

## 📦 Installation

```bash
# Install core runtime
npm install @agentx-cli/core-runtime

# Install CLI
npm install -g @agentx-cli/cli

# Or install all packages
npm install @agentx-cli/autonomous-cognition @agentx-cli/reasoning-framework @agentx-cli/workflow-engine
```

## Quick Start

```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm build
pnpm test
```

## E2E Demo

Run the end-to-end demo to see AgentX in action:

```bash
# Run E2E demo (CLI → Runtime → Agent → LLM → Response)
pnpm demo "Explain what is AgentX"

# Or with custom goal
pnpm demo "Write a Python function to calculate fibonacci"
```

The demo will:

1. ✅ Initialize the runtime
2. ✅ Create and enqueue a task
3. ✅ Call LLM provider (Anthropic/OpenAI)
4. ✅ Display the response
5. ✅ Show task status

**Note:** Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in your `.env` file for real LLM calls.

## CLI Commands

### Using Local Development

```bash
# Submit a new task
pnpm agentx submit "Write a REST API for user management" --role coder

# Check task status
pnpm agentx status
pnpm agentx status <task-id>
```

### Using Published npm Package

```bash
# Install CLI globally
npm install -g @agentx-cli/cli

# Submit task
agentx submit "Your goal here" --role coder

# Check status
agentx status

# Run demo
agentx demo "Explain quantum computing"
```

### All Available Commands

```bash
# Task Management
agentx submit <goal> [--role <role>]    # Submit new task
agentx status [task-id]                 # Check task status
agentx approve <task-id>                # Approve pending task
agentx reject <task-id>                 # Reject pending task

# Queue Management
agentx dlq list                         # List failed tasks
agentx dlq size                         # Show DLQ size
agentx dlq clear                        # Clear DLQ

# System Commands
agentx shutdown [reason]                # Graceful shutdown
agentx config                           # Manage configuration
agentx cost                             # Show cost analysis
agentx audit                            # Run security audit

# Testing
pnpm test:load                          # Load tests (100-1000 users)
pnpm test:security                      # OWASP Top 10 tests
pnpm security:scan                      # Security scan
```

## Architecture

Please see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Handbook

The full architecture specification and authoritative documentation live in the separate `agentx-handbook` repository.
