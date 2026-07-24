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
6. **Agent Architecture** - Orchestrator + DevOps + Sub-Agents model
7. **MCP-First** - Always use MCP tools before implementation

---

## 🤖 Agent Architecture

### Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│  - Planning, coordination, CI/CD, merge decisions        │
│  - DevOps: build, test, deploy, monitoring               │
│  - MCP Exploration before each task                      │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓
   ┌────────┐      ┌────────┐      ┌────────┐
   │ Agent 1│      │ Agent 2│      │ Agent 3│
   │ (Dev)  │      │ (Dev)  │      │ (Dev)  │
   └────────┘      └────────┘      └────────┘
```

### Roles

| Role             | Responsibility                                           | Key Rules                                                                           |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Orchestrator** | Planning, task assignment, coordination, merge decisions | - Uses MCP before planning<br>- Assigns tasks to sub-agents<br>- Reviews PRs        |
| **DevOps**       | CI/CD, build, test, deploy, monitoring, infrastructure   | - **BLOCKS merge if CI red**<br>- Runs pre-PR testing<br>- Monitors deployments     |
| **Sub-Agents**   | Parallel implementation of specific tasks                | - Use MCP for exploration<br>- Execute assigned batches<br>- Report to Orchestrator |

### MCP Usage (Required for All Roles)

**Before EVERY task:**

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

**When to Use MCP:**

| Use MCP ✅              | Don't Use MCP ❌                         |
| ----------------------- | ---------------------------------------- |
| Find function/class     | Search string literals                   |
| Trace call graph        | Search error messages                    |
| Understand architecture | Search config files                      |
| Code review             | MCP returns insufficient → grep fallback |

### Sub-Agent Scaling

| Scenario         | Sub-Agents | Example Tasks                         |
| ---------------- | ---------- | ------------------------------------- |
| **Small batch**  | 2-3        | Fix CI, update docs, run tests        |
| **Medium batch** | 4-6        | Implement 3 agents + 2 tools + 1 test |
| **Large batch**  | 8-10       | Full phase implementation             |

---

## 🚨 DevOps Golden Rule

```
┌─────────────────────────────────────────────────────────┐
│  ⛔ RULE: NO MERGE / NO NEXT PHASE IF CI IS RED         │
└─────────────────────────────────────────────────────────┘
```

### DevOps Responsibilities

1. **Pre-PR Testing** (Required before every PR)

   ```bash
   # Run full CI pipeline locally
   pnpm typecheck  → MUST PASS ✅
   pnpm lint       → MUST PASS ✅ (warnings OK, errors NO)
   pnpm build      → MUST PASS ✅
   pnpm test       → MUST PASS ✅
   pnpm test:coverage → Check threshold
   ```

2. **CI Gate Monitoring**
   - Watch GitHub Actions status
   - Block merge if any job fails
   - Notify team of failures

3. **Phase/Batch Progression**

   ```
   Current Batch Complete? → CI Green? → YES → Next Batch
                                      ↓
                                      NO → FIX FIRST
   ```

4. **Rollback Authority**
   - If production issue detected
   - Revert last merge immediately
   - Create incident ticket

### CI Status Rules

| CI Status        | DevOps Action                        |
| ---------------- | ------------------------------------ |
| ✅ All green     | Approve merge, proceed to next batch |
| ⚠️ Warnings only | Can merge (fix in follow-up)         |
| ❌ Any failure   | **BLOCK MERGE**, fix first           |

### Docs-Only Fast Path

```
┌──────────────────────────────────────────────────────────────┐
│  ⚡ RULE: DOCS-ONLY CHANGES → AUTO-MERGE (NO CI REQUIRED)   │
└──────────────────────────────────────────────────────────────┘
```

**Criteria for Auto-Merge:**

| File Type                               | Auto-Merge? | CI Required? |
| --------------------------------------- | ----------- | ------------ |
| `*.md` (docs only)                      | ✅ YES      | ❌ NO        |
| `docs/**/*.md`                          | ✅ YES      | ❌ NO        |
| `README.md`                             | ✅ YES      | ❌ NO        |
| `CHANGELOG.md`                          | ✅ YES      | ❌ NO        |
| Code files (`*.ts`, `*.js`, etc.)       | ❌ NO       | ✅ YES       |
| Config files (`*.json`, `*.yaml`, etc.) | ❌ NO       | ✅ YES       |

**DevOps Auto-Merge Process:**

```bash
# 1. Check if PR is docs-only
git diff --name-only HEAD~1 HEAD | grep -v '\.md$'

# If NO output → docs-only → AUTO-MERGE
# If output exists → code changes → CI REQUIRED

# 2. Auto-merge (if docs-only)
git merge --no-ff <branch>

# 3. Skip CI checks
# No typecheck, lint, build, test required
```

**Examples:**

| PR Content                            | Action         |
| ------------------------------------- | -------------- |
| Updated README.md                     | ✅ Auto-merge  |
| Added docs/guides/new-feature.md      | ✅ Auto-merge  |
| Updated WORKFLOW.md                   | ✅ Auto-merge  |
| Updated MASTER_PLAN_PRODUCTION.md     | ✅ Auto-merge  |
| Changed packages/runtime/src/index.ts | ❌ CI required |
| Changed package.json                  | ❌ CI required |

---

## 📊 Progress Tracking

### Update Master Plan After Merge

**After EVERY batch/phase merge**, update progress:

```bash
# 1. Verify CI is green
gh run list --limit 1 --jq '.[0].conclusion'  # Must be "success"

# 2. Update MASTER_PLAN_PRODUCTION.md
# Mark batch as complete with checkmark ✅
# Add PR link
# Add completion date

# 3. Update WORKFLOW.md
# Update "Current Phase" table
# Mark batch status as "Complete"

# 4. Commit progress update
git add MASTER_PLAN_PRODUCTION.md WORKFLOW.md
git commit -m "docs: update progress - Phase X Batch Y complete"
git push origin main
```

### Progress Update Template

**In MASTER_PLAN_PRODUCTION.md:**

```markdown
## Batch 0.1: Remove Committed Secrets

### Tasks

- [x] Rotate all API keys ✅
- [x] Remove .env files from git ✅
- [x] Create .env.example ✅

### Status

- **Completed:** July 24, 2026
- **PR:** #50
- **CI:** ✅ Green
```

**In WORKFLOW.md:**

```markdown
### Current Phase

**Phase 0: Cleanup & Security** (Week 0)

| Batch                  | Status         | PR  | Notes               |
| ---------------------- | -------------- | --- | ------------------- |
| 0.1 - Remove Secrets   | ✅ Complete    | #50 | All secrets removed |
| 0.2 - Remove Artifacts | ⬜ Not started | -   | Next                |
```

### Auto-Continue to Next Session

**After progress update:**

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Batch Complete → CI Green → Docs Updated           │
│     ↓                                                   │
│  🚀 AUTO-CONTINUE to Next Batch/Session                │
└─────────────────────────────────────────────────────────┘
```

**Process:**

1. **Verify batch complete:**
   - All tasks checked ✅
   - PR merged ✅
   - CI green ✅

2. **Update docs:**
   - MASTER_PLAN_PRODUCTION.md ✅
   - WORKFLOW.md ✅

3. **Auto-continue:**
   - Read next batch in MASTER_PLAN_PRODUCTION.md
   - Create feature branch for next batch
   - Start MCP exploration
   - Launch sub-agents for implementation

**Example Flow:**

```bash
# Batch 0.1 complete
→ Update docs
→ Push progress
→ Auto-continue to Batch 0.2

# Next session starts automatically
git checkout -b phase0-batch0.2-remove-artifacts
# MCP exploration
# Sub-agent assignment
# Implementation
```

### Session Continuity Rules

| Condition                                | Action                              |
| ---------------------------------------- | ----------------------------------- |
| Batch complete + CI green + docs updated | ✅ Auto-continue to next batch      |
| Batch complete + CI red                  | ❌ Block, fix CI first              |
| Batch complete + docs not updated        | ⚠️ Update docs first, then continue |
| Batch incomplete                         | ❌ Finish batch first               |

### Pre-PR Testing Checklist

**DevOps MUST verify before PR creation:**

```bash
# 1. Setup Environment
pnpm install
docker run -d -p 6379:6379 redis:7
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
pnpm prisma generate

# 2. Run Full CI Pipeline
pnpm typecheck    # HARUS HIJAU ✅
pnpm lint         # HARUS HIJAU ✅ (warnings OK, errors NO)
pnpm build        # HARUS HIJAU ✅
pnpm test         # HARUS HIJAU ✅
pnpm test:coverage # Cek threshold ≥ 80%

# 3. Integration Tests (jika ada Redis/DB)
# Test dengan real Redis connection
# Test dengan real PostgreSQL connection
# Test dengan BullMQ queues

# 4. Clean Up
docker stop $(docker ps -q)
```

**If ANY step fails → FIX FIRST, don't create PR!**

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

### Step 5: Local Testing (CRITICAL - MANDATORY)

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠️  RULE: NO PR WITHOUT FULL LOCAL TEST                    │
│     Reduce CI failures by testing locally FIRST             │
└──────────────────────────────────────────────────────────────┘
```

**Before creating PR**, run full CI pipeline locally:

```bash
# 1. Install dependencies
pnpm install

# 2. Typecheck - MUST PASS ✅
pnpm typecheck

# 3. Lint - MUST PASS ✅ (warnings OK, errors NO)
pnpm lint

# 4. Build - MUST PASS ✅
pnpm build

# 5. Tests - MUST PASS ✅
pnpm test

# 6. Coverage - Check threshold ≥ 80% ✅
pnpm test:coverage
```

**Pre-PR Test Checklist:**

```
┌─────────────────────────────────────────────────────────────┐
│  PRE-PR CHECKLIST - ALL MUST PASS ✅                        │
├─────────────────────────────────────────────────────────────┤
│  [ ] pnpm typecheck    → HIJAU (0 errors)                  │
│  [ ] pnpm lint         → HIJAU (0 errors)                  │
│  [ ] pnpm build        → HIJAU (0 failures)                │
│  [ ] pnpm test         → HIJAU (0 failures)                │
│  [ ] pnpm test:coverage → ≥ 80% threshold                  │
│  [ ] Integration tests → PASS (if applicable)              │
└─────────────────────────────────────────────────────────────┘
```

**If ANY test fails:**

```bash
# ❌ DON'T: Create PR and hope CI passes
# ✅ DO: Fix locally first, THEN create PR

# 1. Fix the failing tests
# 2. Re-run full pipeline
# 3. Verify ALL green
# 4. THEN create PR
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

### Step 5.5: DevOps Verification (REQUIRED)

**DevOps MUST verify before allowing PR:**

```bash
# Run verification script
./scripts/pre-pr-check.sh

# Or manually:
echo "=== PRE-PR VERIFICATION ==="
echo "1. Typecheck..."
pnpm typecheck || exit 1

echo "2. Lint..."
pnpm lint || exit 1

echo "3. Build..."
pnpm build || exit 1

echo "4. Tests..."
pnpm test || exit 1

echo "5. Coverage..."
pnpm test:coverage || exit 1

echo "✅ ALL CHECKS PASSED - PR CAN BE CREATED"
```

**CI Failure Rate Tracking:**

| Developer | PRs | CI Failures | Failure Rate |
| --------- | --- | ----------- | ------------ |
| Target    | -   | -           | < 10%        |
| Team Avg  | -   | -           | Calculate    |

**If failure rate > 10%:**

- Review pre-PR process
- Add more local test coverage
- Update pre-pr-check.sh script

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

---

## 🌿 Branch Strategy

| Branch          | Purpose             | Protection                      |
| --------------- | ------------------- | ------------------------------- |
| `main`          | Production ready    | Required CI, 2 approvals        |
| `release/v*`    | Release preparation | Required CI, Tech Lead approval |
| `phase*-batch*` | Feature development | Required CI, 1 approval         |
| `hotfix/*`      | Emergency fixes     | Required CI, Tech Lead approval |

**Branch Naming Convention:**

```bash
# Feature branches (tied to Master Plan)
git checkout -b phase0-batch0.1-remove-secrets
git checkout -b phase1-batch1.1-console-log

# Hotfix branches
git checkout -b hotfix/security-fix-2026-07-24
git checkout -b hotfix/ci-fix-2026-07-24

# Release branches
git checkout -b release/v0.2.0-beta.1
git checkout -b release/v1.0.0
```

**Branch Protection Rules:**

- `main`: Requires CI pass, 2 approvals, up-to-date branch
- `release/*`: Requires CI pass, Tech Lead approval
- `phase*-batch*`: Requires CI pass, 1 approval
- `hotfix/*`: Requires CI pass, Tech Lead approval (can be retroactive)

---

## 👀 Code Review Guidelines

### Reviewer Checklist

**Reviewer MUST check:**

- [ ] Pre-PR tests passed (screenshot in PR)
- [ ] MCP exploration documented (which tools used)
- [ ] Tests added/updated (for code changes)
- [ ] Documentation updated (README, API docs, etc.)
- [ ] No `console.log` in production code
- [ ] No hardcoded values (URLs, secrets, etc.)
- [ ] No secrets committed (check .env, config files)
- [ ] No `any` types (unless justified)
- [ ] Error handling added
- [ ] Breaking changes documented

### Approval Requirements

| PR Size  | Lines   | Approvals Required          | Reviewer Level            |
| -------- | ------- | --------------------------- | ------------------------- |
| Small    | <200    | 1 approval                  | Any developer             |
| Medium   | 200-500 | 2 approvals                 | Senior developer          |
| Large    | >500    | 3 approvals + Tech Lead     | Tech Lead + 2 seniors     |
| Critical | Any     | Tech Lead + Security review | Tech Lead + Security team |

**Critical PRs** (always require Tech Lead + Security):

- Authentication/Authorization changes
- Secret handling changes
- API endpoint changes
- Database schema changes
- Security fixes

### Review SLA

| PR Priority   | Review Time | Escalation           |
| ------------- | ----------- | -------------------- |
| P0 (Critical) | 1 hour      | Immediate Slack ping |
| P1 (High)     | 4 hours     | Slack ping after 2h  |
| P2 (Medium)   | 24 hours    | Slack ping after 12h |
| P3 (Low)      | 48 hours    | No escalation        |

---

## 🔒 Security Review for PRs

### When Security Review Required

**Mandatory security review for:**

- Authentication/Authorization changes
- API endpoint changes
- Secret handling changes
- Database query changes (SQL injection risk)
- User input handling (XSS/injection risk)
- File upload/download changes
- CORS/security header changes
- Rate limiting changes

### Security Checklist

**Security reviewer MUST verify:**

- [ ] No secrets in code (API keys, passwords, tokens)
- [ ] Input validation added for all user inputs
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevention (escaping, sanitization)
- [ ] CSRF protection (tokens, SameSite cookies)
- [ ] Rate limiting considered for public endpoints
- [ ] Authentication required for protected routes
- [ ] Authorization checks for resource access
- [ ] Sensitive data encrypted at rest and in transit
- [ ] Audit logging for sensitive operations

### Security Scan Requirements

```bash
# Before PR (developer)
pnpm audit

# Before merge (CI)
pnpm audit --audit-level=high

# Before release (DevOps)
pnpm audit --audit-level=moderate
npx snyk test
```

---

## 🖥️ Environment Management

### Environments

| Environment  | Purpose        | Access             | URL               |
| ------------ | -------------- | ------------------ | ----------------- |
| `local`      | Development    | All developers     | localhost         |
| `staging`    | Pre-production | Dev team only      | staging.agentx.io |
| `production` | Live           | DevOps + Tech Lead | agentx.io         |

### Environment Variables

**`.env.local`** - Local development:

```bash
# Example .env.local
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/agentx_dev
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
```

**`.env.staging`** - Staging environment (committed to repo with placeholder values):

```bash
# Example .env.staging (placeholder values)
NODE_ENV=staging
DATABASE_URL=postgresql://staging-db:5432/agentx_staging
REDIS_URL=redis://staging-redis:6379
ANTHROPIC_API_KEY=REPLACE_IN_STAGING
```

**`.env.production`** - Production (NEVER committed, stored in secrets manager):

```bash
# Stored in AWS Secrets Manager / HashiCorp Vault
NODE_ENV=production
DATABASE_URL=postgresql://prod-db:5432/agentx_prod
REDIS_URL=redis://prod-redis:6379
ANTHROPIC_API_KEY=<from secrets manager>
```

### Environment Deployment Rules

| Environment  | Deployment Trigger   | Approval Required  |
| ------------ | -------------------- | ------------------ |
| `local`      | Developer discretion | None               |
| `staging`    | Merge to `main`      | Auto-deploy        |
| `production` | Release tag          | Tech Lead approval |

---

## 📦 Release Process

### Pre-Release Checklist

**Before creating release:**

- [ ] All tests passing (CI green)
- [ ] Coverage threshold met (≥80%)
- [ ] Documentation updated (README, API docs)
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated (all packages)
- [ ] Security scan passed (0 HIGH/CRITICAL)
- [ ] Performance tests passed (if applicable)
- [ ] Staging deployment verified

### Release Steps

**1. Create release branch:**

```bash
git checkout -b release/v0.2.0-beta.1
```

**2. Update versions:**

```bash
# Update all package.json versions
pnpm changeset version
```

**3. Final CI run:**

```bash
# Ensure CI passes on release branch
git push origin release/v0.2.0-beta.1
# Wait for CI to complete
```

**4. Tag commit:**

```bash
git tag -a v0.2.0-beta.1 -m "Release v0.2.0-beta.1"
git push origin v0.2.0-beta.1
```

**5. Create GitHub Release:**

- Go to GitHub Releases
- Create release from tag
- Add release notes from CHANGELOG.md
- Attach binaries (if applicable)

**6. Publish to npm (if applicable):**

```bash
pnpm changeset publish
```

**7. Deploy to production:**

```bash
# Trigger production deployment
gh workflow run deploy.yml --ref v0.2.0-beta.1
```

**8. Announce release:**

- Slack announcement
- Email to stakeholders
- Social media (if public release)

### Post-Release Checklist

**After release:**

- [ ] Monitor production for errors (1 hour)
- [ ] Check error rates (should not increase)
- [ ] Verify key metrics (latency, throughput)
- [ ] Respond to user feedback
- [ ] Document any issues in post-mortem

---

## 🚨 Emergency Procedures

### Production Incident

**If production issue detected:**

**1. Immediate rollback:**

```bash
# Revert last deployment
git revert HEAD
git push origin main

# Or rollback to specific version
git checkout <last-good-commit>
git push origin main --force
```

**2. Create incident ticket:**

- Severity: P0 (critical) / P1 (high) / P2 (medium)
- Assign to on-call engineer
- Notify stakeholders via Slack

**3. Triage:**

- Assess impact (users affected, revenue impact)
- Identify root cause
- Estimate fix time

**4. Fix and deploy:**

- Create hotfix branch
- Fix issue
- Emergency PR review (Tech Lead + 1 senior)
- Deploy hotfix

**5. Post-mortem (within 24h):**

- Root cause analysis
- Timeline of events
- Prevention measures
- Action items

### Incident Severity Levels

| Severity      | Description                  | Response Time | Escalation         |
| ------------- | ---------------------------- | ------------- | ------------------ |
| P0 - Critical | Service down, data loss      | Immediate     | CTO, all engineers |
| P1 - High     | Major feature broken         | 1 hour        | Tech Lead, on-call |
| P2 - Medium   | Minor feature broken         | 4 hours       | On-call engineer   |
| P3 - Low      | Cosmetic issue, nice-to-have | 24 hours      | No escalation      |

### Emergency Contacts

| Role             | Name            | Contact             |
| ---------------- | --------------- | ------------------- |
| On-call Engineer | [Rotate weekly] | Slack: @on-call     |
| Tech Lead        | [Name]          | Slack: @tech-lead   |
| DevOps Lead      | [Name]          | Slack: @devops-lead |
| CTO              | [Name]          | Slack: @cto         |

---

## 🔧 Troubleshooting

### Common Issues

**CI fails on typecheck:**

```bash
# Run typecheck locally to see errors
pnpm typecheck --verbose

# Fix reported errors
# Common issues:
# - Missing type definitions
# - Import/export mismatches
# - Prisma type errors (run pnpm prisma generate)
```

**Tests fail randomly (flaky tests):**

```bash
# Check for race conditions
pnpm test --run-in-band

# Check for async issues
# Look for missing await keywords
# Check for unhandled Promise rejections
```

**Build fails:**

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build

# Check for:
# - Circular dependencies
# - Missing exports
# - TypeScript configuration issues
```

**Coverage threshold not met:**

```bash
# Check which files have low coverage
pnpm test:coverage --thresholds=auto

# Add tests for uncovered lines
# Or add /* istanbul ignore next */ for unavoidable cases
```

**Dependency conflicts:**

```bash
# Check for duplicate versions
pnpm why <package-name>

# Resolve conflicts with overrides
# Add to pnpm-workspace.yaml overrides section
```

**Memory issues during build:**

```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### Debug Mode

**Enable verbose logging:**

```bash
# For builds
pnpm build --verbose

# For tests
pnpm test --verbose

# For typecheck
pnpm typecheck --extendedDiagnostics
```

### Getting Help

**If stuck:**

1. Check troubleshooting guide (this section)
2. Search existing issues
3. Ask in Slack #help channel
4. Create issue with:
   - Error message
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details

---

## 📋 Team Metrics

### Development Metrics

| Metric               | Target     | Current | Review Cadence |
| -------------------- | ---------- | ------- | -------------- |
| PR size              | <400 lines | -       | Weekly         |
| PR review time       | <24h       | -       | Weekly         |
| CI pass rate         | >90%       | -       | Weekly         |
| Bug escape rate      | <5%        | -       | Monthly        |
| Test coverage        | >80%       | 92%*    | Per PR         |
| Technical debt ratio | <10%       | -       | Monthly        |

_\*Many stub tests, not real coverage_

### Review Cadence

| Meeting               | Frequency | Duration | Attendees           | Metrics Reviewed    |
| --------------------- | --------- | -------- | ------------------- | ------------------- |
| Sprint Review         | Bi-weekly | 30 min   | Dev team            | Sprint metrics      |
| Metrics Review        | Weekly    | 15 min   | Tech Lead + PM      | Weekly metrics      |
| Process Improvement   | Monthly   | 1 hour   | All engineers       | All metrics         |
| Workflow Optimization | Quarterly | 2 hours  | Tech Lead + seniors | Workflow efficiency |

### Metric Definitions

**PR size:**

- Lines added + removed
- Target: <400 lines (easier to review)

**PR review time:**

- Time from PR creation to first review
- Target: <24h (unblock developers)

**CI pass rate:**

- Percentage of CI runs that pass
- Target: >90% (reliable pipeline)

**Bug escape rate:**

- Bugs found in production / total bugs
- Target: <5% (catch bugs before production)

**Technical debt ratio:**

- TODO/FIXME comments / total lines
- Target: <10% (manageable debt)

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

# Stash changes
git stash

# Apply stashed changes
git stash pop
```

### Appendix B: Pre-PR Checklist (Printable)

```
┌─────────────────────────────────────────────────────────────┐
│  PRE-PR CHECKLIST                                            │
├─────────────────────────────────────────────────────────────┤
│  [ ] pnpm typecheck    → HIJAU (0 errors)                  │
│  [ ] pnpm lint         → HIJAU (0 errors)                  │
│  [ ] pnpm build        → HIJAU (0 failures)                │
│  [ ] pnpm test         → HIJAU (0 failures)                │
│  [ ] pnpm test:coverage → ≥ 80% threshold                  │
│  [ ] MCP exploration documented                             │
│  [ ] Tests added/updated                                    │
│  [ ] Documentation updated                                  │
│  [ ] No console.log in production code                      │
│  [ ] No hardcoded values                                    │
│  [ ] No secrets committed                                   │
│  [ ] Pre-PR test screenshot attached to PR                  │
└─────────────────────────────────────────────────────────────┘
```

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
**Version:** 2.4

---

## 🔀 Hybrid Approach: MCP + Shell Tools

### When to Use What

**Save 80-99% tokens by using the right tool!**

| Task                    | Best Tool                  | Why                        | Token Savings |
| ----------------------- | -------------------------- | -------------------------- | ------------- |
| Find function/class     | **MCP** `search_graph`     | Understands code structure | -             |
| Find string literal     | **grep/rg**                | Faster, precise            | ~80%          |
| Find file by name       | **find/glob**              | Simple, fast               | ~90%          |
| Read source code        | **MCP** `get_code_snippet` | Context-aware              | -             |
| Check git status        | **git** commands           | Direct info                | ~95%          |
| Parse JSON              | **jq**                     | Structured output          | ~70%          |
| Count lines/files       | **wc/find**                | Quick stats                | ~99%          |
| Compare files           | **diff**                   | Shows only differences     | ~85%          |
| Directory structure     | **tree**                   | Visual overview            | ~60%          |
| Trace dependencies      | **MCP** `trace_path`       | Code-aware tracing         | -             |
| Understand architecture | **MCP** `get_architecture` | High-level view            | -             |

### Token-Saving Examples

**Example 1: Find packages missing license**

❌ **Inefficient (MCP only):**

```bash
# 1. get_architecture() → 1000 tokens
# 2. search_graph("package.json") → 500 tokens
# 3. Read each package.json → 5000 tokens
# Total: 6500+ tokens
```

✅ **Efficient (Hybrid):**

```bash
# 1. Find all package.json
find packages -name "package.json" -not -path "*/node_modules/*" | wc -l
# 51 packages

# 2. Find missing license
find packages -name "package.json" -exec grep -L '"license"' {} \; | wc -l
# 0 missing

# Total: ~50 tokens (99% savings!)
```

**Example 2: Find console.log in source**

❌ **Inefficient:**

```bash
# MCP search_graph → 500 tokens
# Read files → 2000 tokens
```

✅ **Efficient:**

```bash
grep -r "console\.log" packages/*/src --include="*.ts" | grep -v test
# 2 results in 0.5 seconds
# Total: ~10 tokens (98% savings!)
```

**Example 3: Check what files changed**

❌ **Inefficient:**

```bash
# Read each file to check changes → 1000+ tokens
```

✅ **Efficient:**

```bash
git diff --name-only HEAD~1
# Shows all changed files instantly
# Total: ~5 tokens (99.5% savings!)
```

---

## 🛠️ Complete MCP Tools Guide

### Available MCP Tools (codebase-memory-mcp)

| Tool                               | Purpose                              | When to Use                     | Token Cost  |
| ---------------------------------- | ------------------------------------ | ------------------------------- | ----------- |
| `get_architecture()`               | High-level architecture overview     | Start of new phase/batch        | Medium      |
| `search_graph(pattern)`            | Find code by name pattern            | Find functions, classes, routes | Medium      |
| `trace_path(function, direction)`  | Trace dependencies                   | Understand call graph           | Medium      |
| `get_code_snippet(qualified_name)` | Read specific function/class source  | Read implementation details     | Low-Medium  |
| `query_graph(cypher)`              | Complex queries with Cypher          | Find patterns across codebase   | Medium-High |
| `search_code(pattern)`             | Search code content                  | Alternative to grep             | Medium      |
| `list_projects()`                  | List indexed projects                | Multi-project repos             | Low         |
| `index_status(project)`            | Check index status                   | Verify MCP is ready             | Low         |
| `detect_changes()`                 | Detect codebase changes              | After major changes             | Low         |
| `manage_adr(action)`               | Manage Architecture Decision Records | ADR workflow                    | Low         |

### MCP Tool Usage by Phase

**Phase 0 (Cleanup):**

```bash
# Minimal MCP needed - use shell tools
find packages -name "package.json"  # Shell (99% token savings)
grep -r "console.log" packages/     # Shell (98% token savings)
git diff --name-only                # Shell (99% token savings)

# MCP only for:
get_architecture()  # Once at start to understand structure
```

**Phase 1-2 (Code Quality):**

```bash
# Hybrid approach
grep -r "eslint-disable" packages/  # Find eslint disables
search_graph(name_pattern=".*any.*") # Find any types (MCP)
get_code_snippet(qualified_name="pkg/file.Class") # Read specific code
```

**Phase 3+ (Implementation):**

```bash
# More MCP for code understanding
get_architecture()           # Understand big picture
search_graph(name_pattern=".*Handler.*") # Find handlers
trace_path(function_name="Handler", direction="inbound") # Trace callers
trace_path(function_name="Handler", direction="outbound") # Trace calls
get_code_snippet(qualified_name="pkg/file.Handler") # Read implementation
```

### MCP Best Practices

**✅ DO:**

```bash
# 1. Use MCP at start of phase/batch
get_architecture()

# 2. Use MCP for code understanding
search_graph(name_pattern=".*TargetFunction.*")
trace_path(function_name="TargetFunction", direction="inbound")

# 3. Use shell tools for simple searches
grep -r "TODO" packages/
find . -name "*.md" | wc -l

# 4. Combine MCP + shell for efficiency
search_graph(name_pattern=".*Handler.*")  # Find handlers
grep -r "console.log" packages/agent/     # Find logs in specific dir
```

**❌ DON'T:**

```bash
# Don't use MCP for simple string search
search_graph(pattern="TODO")  # Use grep instead

# Don't use MCP to count files
# Use find | wc -l instead

# Don't use MCP to check git status
# Use git status instead
```

### Token Budget by Phase

| Phase                      | MCP Usage | Shell Usage | Est. Tokens |
| -------------------------- | --------- | ----------- | ----------- |
| Phase 0 (Cleanup)          | 10%       | 90%         | ~500        |
| Phase 1-2 (Quality)        | 30%       | 70%         | ~2000       |
| Phase 3-5 (Implementation) | 50%       | 50%         | ~5000       |
| Phase 6-8 (Production)     | 40%       | 60%         | ~3000       |

**Total estimated savings: 80-90% vs MCP-only approach**

---

## 📊 Efficiency Metrics

### Track Your Efficiency

**After each batch, calculate:**

```bash
# Token efficiency
tokens_used / tasks_completed = tokens_per_task

# Tool efficiency
mcp_calls / shell_calls = hybrid_ratio

# Time efficiency
time_spent / tasks_completed = time_per_task
```

**Target Metrics:**

| Metric                   | Target  | Current |
| ------------------------ | ------- | ------- |
| Tokens per task          | <1000   | -       |
| Hybrid ratio (MCP:Shell) | 1:5     | -       |
| Time per task            | <30 min | -       |

### Continuous Improvement

**Weekly review:**

1. Which tasks used too many tokens?
2. Could shell tools have been used instead?
3. What patterns can be automated?
4. Update this guide with learnings

---

## 🎯 Quick Reference Card

**Print this for quick reference:**

```
┌─────────────────────────────────────────────────────────────┐
│  HYBRID APPROACH QUICK REFERENCE                             │
├─────────────────────────────────────────────────────────────┤
│  FIND FILES:     find . -name "*.ts" | wc -l                │
│  FIND STRINGS:   grep -r "pattern" packages/ --include=*.ts │
│  CHECK GIT:      git diff --name-only HEAD~1                │
│  PARSE JSON:     jq '.field' file.json                      │
│  COUNT LINES:    wc -l file.txt                              │
│  STRUCTURE:      tree -L 2 -I 'node_modules'                │
│  COMPARE:        diff file1 file2                            │
├─────────────────────────────────────────────────────────────┤
│  MCP TOOLS:                                                  │
│  - get_architecture()        → Start of phase               │
│  - search_graph(pattern)     → Find code                    │
│  - trace_path(func, dir)     → Trace dependencies           │
│  - get_code_snippet(name)    → Read source                  │
│  - query_graph(cypher)       → Complex queries              │
├─────────────────────────────────────────────────────────────┤
│  RULE: Use shell tools for 80% of searches, MCP for 20%    │
│        (code understanding only)                            │
│  SAVINGS: 80-99% token reduction                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Last Updated:** July 24, 2026  
**Version:** 2.5 (Hybrid Approach Added)
