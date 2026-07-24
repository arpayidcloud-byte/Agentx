# AgentX Development Workflow

**Version:** 2.0  
**Created:** July 24, 2026  
**Status:** Active  
**Supersedes:** WORKFLOW.md v1.3 (archived)

---

## 🎯 Purpose

This document defines the **standard development workflow** for AgentX, aligned with our [Production Master Plan](./MASTER_PLAN_PRODUCTION.md).

---

## 📋 Core Principles

1. **Master Plan First** - All work ties back to [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md)
2. **CI Gates** - No merge without green CI
3. **Small Batches** - Frequent, small PRs (not large monolithic changes)
4. **Documentation** - Code changes require doc updates
5. **Testing** - No feature without tests

---

## 🏗️ Project Structure

```
AgentX/
├── MASTER_PLAN_PRODUCTION.md    ← MAIN REFERENCE
├── ARCHITECTURE.md              ← Architecture reference
├── WORKFLOW.md                  ← This file
├── apps/
│   └── cli/                     ← CLI application
├── packages/                    ← 45 packages
│   ├── agent/                   ← Agent layer
│   ├── cognitive/               ← Cognitive layer
│   ├── runtime/                 ← Runtime layer
│   ├── shared/                  ← Shared utilities
│   └── ...                      ← See ARCHITECTURE.md
├── docs/
│   ├── archive/                 ← Historical docs
│   ├── api/                     ← API reference
│   └── ...                      ← Supporting docs
├── tests/
│   └── e2e/                     ← End-to-end tests
└── tooling/                     ← Dev tools
```

---

## 🚀 Development Workflow

### Step 1: Check Master Plan

**Before starting any work**, check [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md):

```bash
# Which phase are we in?
# Current: Phase 0 (Cleanup & Security)

# What batch does this task belong to?
# Example: Batch 0.1 - Remove Committed Secrets

# What are the success criteria?
```

### Step 2: Create Feature Branch

```bash
# Branch naming convention:
# <phase>-<batch>-<description>

# Examples:
git checkout -b phase0-batch0.1-remove-secrets
git checkout -b phase0-batch0.2-remove-artifacts
git checkout -b phase1-batch1.1-console-log
```

### Step 3: MCP Exploration (Required)

**Before coding**, use MCP tools to understand the codebase:

```bash
# 1. Understand architecture
get_architecture()

# 2. Find relevant code
search_graph(name_pattern=".*TargetFunction.*")

# 3. Trace dependencies
trace_path(function_name="TargetFunction", direction="inbound")
trace_path(function_name="TargetFunction", direction="outbound")

# 4. Read source code
get_code_snippet(qualified_name="pkg/file.Class")

# 5. Query for complex patterns
query_graph(query="MATCH (n:Node) WHERE n.property = 'value' RETURN n")
```

**When to use MCP:**

| Use MCP ✅              | Don't Use MCP ❌                         |
| ----------------------- | ---------------------------------------- |
| Find function/class     | Search string literals                   |
| Trace call graph        | Search error messages                    |
| Understand architecture | Search config files                      |
| Code review             | MCP returns insufficient → grep fallback |

### Step 4: Implement Changes

**Coding standards:**

```typescript
// ✅ DO: Use logger abstraction
import { logger } from '@agentx/shared';
logger.info('User authenticated', { userId });

// ❌ DON'T: Use console.log in production code
console.log('User authenticated:', userId);

// ✅ DO: Use environment variables
const API_URL = process.env.API_URL || 'http://localhost:3000';

// ❌ DON'T: Hardcode values
const API_URL = 'http://localhost:3000';

// ✅ DO: Use proper types
function processUser(user: User): Promise<Result> {}

// ❌ DON'T: Use any type
function processUser(user: any): any {}
```

### Step 5: Local Testing (Required)

**Before creating PR**, run full CI pipeline locally:

```bash
# 1. Install dependencies
pnpm install

# 2. Typecheck - MUST PASS
pnpm typecheck

# 3. Lint - MUST PASS (warnings OK, errors NO)
pnpm lint

# 4. Build - MUST PASS
pnpm build

# 5. Tests - MUST PASS
pnpm test

# 6. Coverage - Check threshold
pnpm test:coverage
```

**For integration tests:**

```bash
# Start Redis
docker run -d -p 6379:6379 redis:7

# Start PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16

# Generate Prisma client
pnpm prisma generate

# Run E2E tests
pnpm test:e2e

# Cleanup
docker stop $(docker ps -q)
```

### Step 6: Create PR

**PR Requirements:**

```markdown
## Description

[Brief description of changes]

## Related Phase

- Phase: [0-8]
- Batch: [e.g., 0.1]
- Master Plan: [Link to specific section in MASTER_PLAN_PRODUCTION.md]

## Checklist

- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] Coverage threshold met
- [ ] Documentation updated

## Testing

[How to test these changes]

## Breaking Changes

[List any breaking changes, or "None"]
```

### Step 7: CI Gate

**CI Pipeline:**

```yaml
Jobs (in order):
1. typecheck  → TypeScript compilation
2. lint       → ESLint + Prettier
3. build      → Compile all packages
4. test       → Unit tests
5. coverage   → Coverage thresholds
6. e2e        → End-to-end tests (if applicable)
7. security   → pnpm audit
```

**Merge Rules:**

| CI Status        | Action                       |
| ---------------- | ---------------------------- |
| ✅ All green     | Merge immediately            |
| ⚠️ Warnings only | Can merge (fix in follow-up) |
| ❌ Any failure   | DO NOT MERGE - fix first     |

### Step 8: Post-Merge

**After merge:**

1. **Verify deployment** (if applicable)
2. **Update Master Plan** (mark batch as complete)
3. **Notify stakeholders** (if major change)

---

## 📦 Package Management

### Adding Dependencies

```bash
# Add to specific package
pnpm add --filter @agentx/runtime <package>

# Add to root workspace
pnpm add -w <package>

# Add as dev dependency
pnpm add -D <package>
```

### Version Management

```bash
# All packages use workspace protocol
# In package.json:
{
  "dependencies": {
    "@agentx/shared": "workspace:*"
  }
}

# For external packages, use caret (^) for versions
{
  "dependencies": {
    "typescript": "^5.4.5"
  }
}
```

---

## 🧪 Testing Strategy

### Test Types

| Type        | Location                               | When to Run    |
| ----------- | -------------------------------------- | -------------- |
| Unit        | `packages/*/src/*.test.ts`             | Every commit   |
| Integration | `packages/*/src/*.integration.test.ts` | Before PR      |
| E2E         | `tests/e2e/`                           | Before release |
| Load        | `tests/load/`                          | Phase 5+       |
| Security    | `tests/security/`                      | Phase 5+       |

### Coverage Thresholds

| Package Type | Lines | Branches | Functions |
| ------------ | ----- | -------- | --------- |
| Core runtime | 90%   | 85%      | 90%       |
| Shared utils | 85%   | 80%      | 85%       |
| Agents       | 80%   | 75%      | 80%       |
| Tooling      | 75%   | 70%      | 75%       |

---

## 🔒 Security Guidelines

### Secret Management

```bash
# NEVER commit secrets
# Add to .gitignore:
.env
.env.local
.env.test
.env.production

# Use environment variables
export ANTHROPIC_API_KEY="sk-..."

# Or use secrets manager
pnpm secrets get ANTHROPIC_API_KEY
```

### Security Scans

```bash
# Before PR
pnpm audit

# Before release
pnpm audit --audit-level=high

# CI runs automatically
# Any HIGH/CRITICAL = build fails
```

---

## 📝 Documentation

### When to Update Docs

| Change Type     | Docs Required              |
| --------------- | -------------------------- |
| New feature     | API docs, README           |
| Breaking change | Migration guide, CHANGELOG |
| Bug fix         | None (unless significant)  |
| Performance     | None (unless significant)  |
| Security        | Security advisory          |

### Documentation Structure

```
docs/
├── README.md                 ← Documentation portal
├── getting-started.md        ← New user guide
├── guides/
│   ├── CONTRIBUTING.md       ← Contribution guide
│   ├── DEVELOPMENT.md        ← Development setup
│   └── MIGRATION_*.md        ← Migration guides
├── api/                      ← Auto-generated (TypeDoc)
├── design/                   ← Design documents
├── deployment/               ← Deployment guides
├── security/                 ← Security docs
└── archive/                  ← Historical docs
```

---

## 🚨 Issue Resolution

### P0 - Critical

**Response Time:** Immediate  
**Examples:** Security vulnerability, production outage

```bash
# 1. Create issue with P0 label
# 2. Assign to available engineer
# 3. Fix in dedicated branch
# 4. Emergency PR review (2 approvals)
# 5. Merge and deploy immediately
# 6. Post-mortem within 24h
```

### P1 - High

**Response Time:** 24 hours  
**Examples:** Build broken, tests failing

```bash
# 1. Create issue with P1 label
# 2. Assign to next sprint
# 3. Fix in feature branch
# 4. Normal PR review (1 approval)
# 5. Merge on next release
```

### P2 - Medium

**Response Time:** 1 week  
**Examples:** Minor bugs, tech debt

```bash
# 1. Create issue with P2 label
# 2. Add to backlog
# 3. Prioritize in sprint planning
```

### P3 - Low

**Response Time:** Next quarter  
**Examples:** Nice-to-have, enhancements

```bash
# 1. Create issue with P3 label
# 2. Add to backlog
# 3. Review quarterly
```

---

## 📊 Master Plan Alignment

### Current Phase

**Phase 0: Cleanup & Security** (Week 0)

| Batch                    | Status         | PR  | Notes    |
| ------------------------ | -------------- | --- | -------- |
| 0.1 - Remove Secrets     | ⬜ Not started | -   | CRITICAL |
| 0.2 - Remove Artifacts   | ⬜ Not started | -   | HIGH     |
| 0.3 - Fix Stub Packages  | ⬜ Not started | -   | HIGH     |
| 0.4 - Standardize Prisma | ⬜ Not started | -   | HIGH     |

### Phase Timeline

```
Week 0:   Phase 0 - Cleanup & Security ⬅️ CURRENT
Week 1-2: Phase 1 - Code Quality & Standards
Week 3-4: Phase 2 - Security Hardening
Week 5-6: Phase 3 - Core Functionality
Week 7-8: Phase 4 - Reliability & Resilience
Week 9-10: Phase 5 - Testing & QA
Week 11-12: Phase 6 - Monitoring & Observability
Week 13-14: Phase 7 - Documentation & Runbooks
Week 15-16: Phase 8 - Final Validation & Release
```

**See [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md) for detailed phase plans.**

---

## 🛠️ Tooling

### Required Tools

| Tool       | Version  | Purpose         |
| ---------- | -------- | --------------- |
| Node.js    | >=20.0.0 | Runtime         |
| pnpm       | 11.13.0  | Package manager |
| TypeScript | 5.4.5    | Language        |
| Vitest     | ^3.2.6   | Testing         |
| ESLint     | ^8.57.0  | Linting         |
| Prettier   | ^3.3.0   | Formatting      |

### MCP Tools

| Tool                               | Purpose                          |
| ---------------------------------- | -------------------------------- |
| `get_architecture()`               | High-level architecture overview |
| `search_graph(pattern)`            | Find code by pattern             |
| `trace_path(function, direction)`  | Trace dependencies               |
| `get_code_snippet(qualified_name)` | Read source code                 |
| `query_graph(cypher)`              | Complex queries                  |

---

## 📈 Metrics

### Development Metrics

| Metric         | Target     | Current |
| -------------- | ---------- | ------- |
| PR size        | <400 lines | -       |
| PR review time | <24h       | -       |
| CI pass rate   | >95%       | -       |
| Test coverage  | >80%       | 92%*    |

_\*Many stub tests, not real coverage_

### Production Readiness Metrics

| Metric                   | Target | Current |
| ------------------------ | ------ | ------- |
| Security vulnerabilities | 0      | 0 ✅    |
| Critical bugs            | 0      | 7 ❌    |
| E2E tests                | 10+    | 0 ❌    |
| Documentation coverage   | 95%    | 85% ⚠️  |

---

## 🎓 Onboarding

### New Developer Checklist

```bash
# 1. Clone repository
git clone https://github.com/arpayidcloud-byte/Agentx.git
cd Agentx

# 2. Install dependencies
pnpm install

# 3. Read documentation
# - README.md
# - ARCHITECTURE.md
# - MASTER_PLAN_PRODUCTION.md
# - CONTRIBUTING.md

# 4. Setup environment
cp .env.example .env
# Edit .env with your values

# 5. Run tests
pnpm test

# 6. Pick first task
# Check MASTER_PLAN_PRODUCTION.md for Phase 0 tasks
```

### First Task Suggestions

1. **Batch 0.1** - Remove committed secrets (if not done)
2. **Batch 0.2** - Remove build artifacts from git
3. **Batch 1.1** - Remove console.log statements
4. **Batch 1.2** - Remove hardcoded URLs

---

## 📞 Communication

### Channels

| Channel       | Purpose                       |
| ------------- | ----------------------------- |
| GitHub Issues | Bug reports, feature requests |
| GitHub PRs    | Code review, discussions      |
| Slack/Discord | Real-time chat                |
| Email         | Formal announcements          |

### Meeting Cadence

| Meeting         | Frequency | Duration | Attendees        |
| --------------- | --------- | -------- | ---------------- |
| Stand-up        | Daily     | 15 min   | Dev team         |
| Sprint Planning | Bi-weekly | 1h       | Dev team + PM    |
| Demo            | Bi-weekly | 30 min   | All stakeholders |
| Retrospective   | Bi-weekly | 30 min   | Dev team         |

---

## 📎 Appendices

### Appendix A: Git Commands

```bash
# Create feature branch
git checkout -b phase0-batch0.1-description

# Sync with main
git fetch origin
git rebase origin/main

# Squash commits before PR
git rebase -i origin/main

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Appendix B: Common Issues

| Issue           | Solution                           |
| --------------- | ---------------------------------- |
| Typecheck fails | Run `pnpm typecheck` to see errors |
| Tests fail      | Run `pnpm test` to see failures    |
| Build fails     | Run `pnpm build` to see errors     |
| Lint fails      | Run `pnpm lint --fix` to auto-fix  |

### Appendix C: References

- [Master Production Plan](./MASTER_PLAN_PRODUCTION.md)
- [Architecture](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Deployment](./DEPLOYMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**Last Updated:** July 24, 2026  
**Next Review:** August 1, 2026  
**Owner:** Engineering Lead  
**Status:** Active
