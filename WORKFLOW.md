# AgentX Project Workflow

**Version:** 1.2
**Created:** July 2026
**Updated:** July 2026
**Purpose:** Acuan utama pengerjaan project AgentX dengan MCP integration

---

## 🎯 Aturan Utama

```
┌─────────────────────────────────────────────────────────┐
│  RULE: TIDAK LANJUT FASE/BATCH BARU JIKA PR BELUM HIJAU │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 MCP Integration

### Codebase Memory MCP

**Status:** ✅ Active
**Config:** `/root/.config/opencode/config.json`
**Binary:** `/root/.local/bin/codebase-memory-mcp`

#### Mandatory MCP Usage (Semua Fase)

**WAJIB gunakan MCP sebelum mulai task:**

```bash
# 1. Pahami architecture
get_architecture()

# 2. Cari relevant code
search_graph(name_pattern=".*FunctionName.*")

# 3. Trace dependencies
trace_path(function_name="X", direction="inbound")

# 4. Baca source code
get_code_snippet(qualified_name="pkg/file.Function")
```

#### MCP Workflow

```
1. ORCHESTRATOR: MCP Exploration
   │
   ├─ get_architecture() → Pahami big picture
   ├─ search_graph(pattern) → Cari relevant code
   ├─ trace_path(function) → Trace dependencies
   └─ get_code_snippet() → Baca implementation
   │
   ↓
2. ORCHESTRATOR: Plan dengan context lengkap
   │
   ↓
3. SUB-AGENTS: Execute dengan MCP reference
```

#### Kapan Gunakan MCP

| Use MCP ✅          | Jangan MCP ❌                           |
| ------------------- | --------------------------------------- |
| Cari function/class | Search string literals                  |
| Trace call graph    | Search error messages                   |
| Pahami architecture | Search config files                     |
| Code review         | MCP return insufficient → grep fallback |

---

## 🏗️ Architecture: Orchestrator + DevOps + Sub-Agents

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│  - Planning, coordination, CI/CD, merge decisions        │
│  - DevOps: build, test, deploy, monitoring               │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓
   ┌────────┐      ┌────────┐      ┌────────┐
   │ Agent 1│      │ Agent 2│      │ Agent 3│
   └────────┘      └────────┘      └────────┘
        │               │               │
        ↓               ↓               ↓
   ┌────────┐      ┌────────┐      ┌────────┐
   │ Agent 4│      │ Agent 5│      │ Agent N│
   └────────┘      └────────┘      └────────┘
```

### Role Definitions

| Role             | Responsibility                                           |
| ---------------- | -------------------------------------------------------- |
| **Orchestrator** | Planning, task assignment, coordination, merge decisions |
| **DevOps**       | CI/CD, build, test, deploy, monitoring, infrastructure   |
| **Sub-Agents**   | Parallel implementation of specific tasks                |

---

## 📊 Dynamic Sub-Agent Scaling

| Scenario         | Sub-Agents | Example Tasks                         |
| ---------------- | ---------- | ------------------------------------- |
| **Small batch**  | 2-3        | Fix CI, update docs, run tests        |
| **Medium batch** | 4-6        | Implement 3 agents + 2 tools + 1 test |
| **Large batch**  | 8-10       | Full phase implementation             |

---

## 🔄 Alur Per Fase/Batch

```
1. ORCHESTRATOR: Check PR status
   │
   ├─ PR hijau? → Lanjut ke batch berikutnya
   └─ PR merah? → FIX DULU, jangan lanjut
   │
   ↓
2. ORCHESTRATOR: MCP Exploration (WAJIB - 5 menit)
   │
   ├─ get_architecture() → Pahami big picture fase ini
   ├─ search_graph(pattern=".*RelevantFunction.*") → Cari code terkait
   ├─ trace_path(function="TargetFunction", direction="inbound") → Trace callers
   ├─ trace_path(function="TargetFunction", direction="outbound") → Trace calls
   └─ get_code_snippet(qualified_name="pkg/file.Class") → Baca implementation
   │
   ↓
3. ORCHESTRATOR: Plan batch tasks (dengan MCP context)
   │
   ├─ Identifikasi tasks dalam batch
   ├─ Assign ke sub-agents (parallel)
   ├─ Set dependencies antar task
   └─ Provide MCP references ke sub-agents
   │
   ↓
4. SUB-AGENTS: Execute parallel (dengan MCP)
   │
   ├─ Sub-Agent A: Task 1 + MCP search/trace
   ├─ Sub-Agent B: Task 2 + MCP search/trace
   └─ Sub-Agent C: Task N + MCP search/trace
   │
   ↓
5. ORCHESTRATOR: Pre-PR Local Testing (WAJIB)
   │
   ├─ 4.1 Setup Environment
   │  ├─ Install dependencies: pnpm install
   │  ├─ Start Redis: docker run -d -p 6379:6379 redis:7
   │  ├─ Start PostgreSQL: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
   │  └─ Generate Prisma: pnpm prisma generate
   │
   ├─ 4.2 Run Full CI Pipeline Locally
   │  ├─ pnpm typecheck → Harus hijau ✅
   │  ├─ pnpm lint → Harus hijau ✅ (warnings OK, errors NO)
   │  ├─ pnpm build → Harus hijau ✅
   │  ├─ pnpm test → Harus hijau ✅
   │  └─ pnpm test:coverage → Cek threshold ≥ 80%
   │
   ├─ 4.3 Integration Tests (jika ada Redis/DB)
   │  ├─ Test dengan real Redis connection
   │  ├─ Test dengan real PostgreSQL connection
   │  └─ Test dengan BullMQ queues
   │
   └─ 4.4 Clean Up
      ├─ Stop containers: docker stop <containers>
      └─ Reset test data
   │
   ↓
6. ORCHESTRATOR: Create PR
   │
   ├─ Push ke branch feature
   ├─ Create/update PR
   └─ Tag reviewers
   │
   ↓
7. ORCHESTRATOR: CI Gate
   │
   ├─ Hanya .md files? → Langsung merge (skip CI)
   ├─ CI hijau? → Merge, lanjut batch berikutnya
   └─ CI merah? → Fix, ULANGI DARI STEP 5 (local test dulu!)
```

---

## 📋 Project Status

### Current State (July 2026)

| Metric                    | Status      |
| ------------------------- | ----------- |
| Handbook Alignment        | ~55-60%     |
| Production-Ready Packages | 8/42 (19%)  |
| Stub/Theater Packages     | 18/42 (43%) |
| Partial Implementation    | 16/42 (38%) |
| End-to-End Flow           | ❌ None     |
| Real Persistence          | ❌ None     |
| LLM Integration           | ❌ None     |

### Phase Progress (Updated: July 23, 2026)

| Phase                          | Status             | PR            | CI          |
| ------------------------------ | ------------------ | ------------- | ----------- |
| Phase 0 — Foundation Cleanup   | ✅ Done            | Merged        | ✅          |
| Phase 1 — Wire Components      | ✅ Done            | Merged        | ✅          |
| Phase 2 — Real Persistence     | ✅ Done            | PR #30 MERGED | ✅          |
| Phase 3 — Agent Implementation | ✅ Done            | Merged        | ✅          |
| Phase 4 — Tool Integration     | ⏸️ **IN PROGRESS** | PR #36 OPEN   | ✅ **PASS** |
| Phase 5 — Cognitive Layer      | ⏳ Pending         | -             | -           |
| Phase 6 — API & Integration    | ⏳ Pending         | -             | -           |
| Phase 7 — Production Hardening | ⏳ Pending         | -             | -           |
| Phase 8 — Documentation        | ⏳ Pending         | -             | -           |

---

## 🚨 Current Blocker

```
Phase 4 (Batch 2) - PR #36 CI PASS ✅
│
├─ Status: OPEN
├─ Branch: feat/phase-4-batch-2-tool-timeout-enforcement
├─ CI Check: quality-gates → SUCCESS
│
└─ Next: Merge PR #36, lanjut Phase 4 Batch 3 atau Phase 5
```

### History Blockers (Resolved)

- ~~Phase 2 (Batch 4) - PR #30 CI GAGAL~~ → **MERGED** ✅

---

## 📁 Reference Documents

| Document                         | Location                                   | Purpose                    |
| -------------------------------- | ------------------------------------------ | -------------------------- |
| **WORKFLOW.md**                  | `/root/Agentx/WORKFLOW.md`                 | **ACUAN UTAMA** (file ini) |
| **IMPLEMENTATION_PLAN_2026.md**  | `/root/Agentx/IMPLEMENTATION_PLAN_2026.md` | Detail plan per phase      |
| **ARCHITECTURE.md**              | `/root/Agentx/ARCHITECTURE.md`             | Arsitektur sistem          |
| **AUDIT_REPORT_AND_PLAN.md**     | `/root/Agentx/docs/plans/`                 | Gap analysis               |
| **MASTER_PLAN_PHASE2_DETAIL.md** | `/root/Agentx/docs/plans/`                 | Phase 2 detail             |

---

## ✅ Checklist Sebelum Create PR (WAJIB)

### 4.1 Environment Setup

- [ ] `pnpm install` — install semua dependencies
- [ ] `docker run -d -p 6379:6379 redis:7` — start Redis
- [ ] `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16` — start PostgreSQL
- [ ] `pnpm prisma generate` — generate Prisma client

### 4.2 Full CI Pipeline Local

- [ ] `pnpm typecheck` — **HARUS** hijau ✅
- [ ] `pnpm lint` — **HARUS** hijau ✅ (warnings OK, errors NO)
- [ ] `pnpm build` — **HARUS** hijau ✅
- [ ] `pnpm test` — **HARUS** hijau ✅
- [ ] `pnpm test:coverage` — threshold ≥ 80%

### 4.3 Integration Tests (jika ada perubahan infra)

- [ ] Test Redis connection
- [ ] Test PostgreSQL connection
- [ ] Test BullMQ queues

### 4.4 Cleanup

- [ ] `docker stop <containers>` — stop test containers
- [ ] Reset test data

---

## ✅ Checklist Sebelum Lanjut Batch Baru

- [ ] Semua PR di batch sebelumnya sudah **MERGED**
- [ ] CI status **HIJAU** (semua checks pass)
- [ ] Test coverage **≥ 80%**
- [ ] Tidak ada **CRITICAL/HIGH** security issues
- [ ] Code review **APPROVED**
- [ ] Documentation **UPDATED**

---

## 🚀 Next Action

**Prioritas #1:** Merge PR #36 (CI sudah hijau)

```
1. ✅ PR #36 CI hijau
2. ⏳ Merge PR #36
3. ⏳ Lanjut Phase 4 Batch 3 atau Phase 5
```

---

## 🧪 Local Testing Setup

### Docker Compose untuk Testing

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  redis:
    image: redis:7
    ports:
      - '6379:6379'
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 3

  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: agentx_test
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 3
```

### MCP Commands Reference

```bash
# 1. Architecture Overview
get_architecture()

# 2. Search Functions/Classes
search_graph(name_pattern=".*Agent.*")
search_graph(name_pattern=".*Provider.*")
search_graph(name_pattern=".*Repository.*")

# 3. Trace Dependencies
trace_path(function_name="submit", direction="inbound")
trace_path(function_name="execute", direction="outbound")

# 4. Read Source Code
get_code_snippet(qualified_name="@agentx/core-runtime.Scheduler")
get_code_snippet(qualified_name="@agentx/agent-platform.BaseAgent")

# 5. Complex Queries
query_graph("MATCH (n:Function) WHERE n.name CONTAINS 'Agent' RETURN n")
```

### Quick Test Script

```bash
#!/bin/bash
# scripts/local-ci.sh

set -e

echo "🚀 Starting local CI pipeline..."

# 1. Start dependencies
echo "📦 Starting Redis and PostgreSQL..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services
sleep 5

# 2. Generate Prisma
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# 3. Run CI pipeline
echo "🔍 Running typecheck..."
pnpm typecheck

echo "🎨 Running lint..."
pnpm lint

echo "🏗️  Running build..."
pnpm build

echo "🧪 Running tests..."
pnpm test

echo "📊 Running coverage..."
pnpm test:coverage

# 4. Cleanup
echo "🧹 Cleaning up..."
docker-compose -f docker-compose.test.yml down

echo "✅ Local CI pipeline complete!"
```

### Environment Variables

```bash
# .env.test
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agentx_test"
REDIS_URL="redis://localhost:6379"
NODE_ENV="test"
```

---

**Document Owner:** Orchestrator
**Last Updated:** July 23, 2026
**Next Review:** Setiap selesai batch
