# AgentX Platform

> Provider-agnostic, multi-agent AI software-engineering platform.

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

```bash
# Submit a new task
pnpm agentx submit "Write a REST API for user management" --role coder

# Check task status
pnpm agentx status
pnpm agentx status <task-id>

# Approve/reject pending tasks
pnpm agentx approve <task-id>
pnpm agentx reject <task-id>

# Run E2E demo
pnpm agentx demo "Your goal here"

# Other commands
pnpm agentx config      # Manage configuration
pnpm agentx cost        # Show cost analysis
pnpm agentx audit       # Run security audit
pnpm agentx plugin      # Manage plugins
pnpm agentx watch       # Watch for changes
```

## Architecture

Please see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Handbook

The full architecture specification and authoritative documentation live in the separate `agentx-handbook` repository.
