# AgentX Platform

> Provider-agnostic, multi-agent AI software-engineering platform.

## 📦 Installation

### CLI (Global Install)

```bash
# Install CLI globally
npm install -g @agentx-fast/cli

# Verify installation
agentx --version
agentx --help
```

### Core Packages

```bash
# Install core runtime
npm install @agentx-fast/core-runtime

# Install individual packages as needed
npm install @agentx-fast/provider-sdk
npm install @agentx-fast/agent-platform
npm install @agentx-fast/tool-sdk
```

## Quick Start

```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm build
pnpm demo "Explain what is AgentX"
```

## 📊 Published Packages (10/52)

| Package                           | Version | Description               |
| --------------------------------- | ------- | ------------------------- |
| `@agentx-fast/cli`                | 1.0.0   | ⭐ Command-line interface |
| `@agentx-fast/core-runtime`       | 1.0.0   | Core runtime utilities    |
| `@agentx-fast/shared`             | 1.0.0   | Shared utilities          |
| `@agentx-fast/observability`      | 1.0.0   | Observability tools       |
| `@agentx-fast/persistence`        | 1.0.0   | Persistence layer         |
| `@agentx-fast/runtime-adapters`   | 1.0.0   | Runtime adapters          |
| `@agentx-fast/provider-sdk`       | 1.0.0   | Provider SDK              |
| `@agentx-fast/agent-platform`     | 1.0.0   | Agent platform            |
| `@agentx-fast/tool-sdk`           | 1.0.0   | Tool SDK                  |
| `@agentx-fast/runtime-production` | 1.0.0   | Production runtime        |

**More packages coming soon!** Check [npm](https://npmjs.com/org/agentx-fast) for updates.

## 🏗️ Architecture

Please see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📚 Handbook

The full architecture specification lives in the separate `agentx-handbook` repository.

## 📝 License

MIT License

---

**GitHub:** https://github.com/arpayidcloud-byte/Agentx  
**npm Org:** https://npmjs.com/org/agentx-fast  
**Docs:** https://github.com/arpayidcloud-byte/agentx-platform
