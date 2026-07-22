# AgentX Project Workflow

**Version:** 1.1
**Created:** July 2026
**Updated:** July 2026
**Purpose:** Acuan utama pengerjaan project AgentX

---

## 🎯 Aturan Utama

```
┌─────────────────────────────────────────────────────────┐
│  RULE: TIDAK LANJUT FASE/BATCH BARU JIKA PR BELUM HIJAU │
└─────────────────────────────────────────────────────────┘
```

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
2. ORCHESTRATOR: Plan batch tasks
   │
   ├─ Identifikasi tasks dalam batch
   ├─ Assign ke sub-agents (parallel)
   └─ Set dependencies antar task
   │
   ↓
3. SUB-AGENTS: Execute parallel
   │
   ├─ Sub-Agent A: Task 1
   ├─ Sub-Agent B: Task 2
   └─ Sub-Agent C: Task N
   │
   ↓
4. ORCHESTRATOR: Pre-PR Local Testing (WAJIB)
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
5. ORCHESTRATOR: Create PR
   │
   ├─ Push ke branch feature
   ├─ Create/update PR
   └─ Tag reviewers
   │
   ↓
6. ORCHESTRATOR: CI Gate
   │
   ├─ CI hijau? → Merge, lanjut batch berikutnya
   └─ CI merah? → Fix, ULANGI DARI STEP 4 (local test dulu!)
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

### Phase Progress

| Phase                          | Status         | PR          | CI           |
| ------------------------------ | -------------- | ----------- | ------------ |
| Phase 0 — Foundation Cleanup   | ✅ Done        | Merged      | ✅           |
| Phase 1 — Wire Components      | ✅ Done        | Merged      | ✅           |
| Phase 2 — Real Persistence     | ⏸️ **BLOCKED** | PR #30 OPEN | ❌ **GAGAL** |
| Phase 3 — Agent Implementation | ⏳ Pending     | -           | -            |
| Phase 4 — Tool Integration     | ⏳ Pending     | -           | -            |
| Phase 5 — Cognitive Layer      | ⏳ Pending     | -           | -            |
| Phase 6 — API & Integration    | ⏳ Pending     | -           | -            |
| Phase 7 — Production Hardening | ⏳ Pending     | -           | -            |
| Phase 8 — Documentation        | ⏳ Pending     | -           | -            |

---

## 🚨 Current Blocker

```
Phase 2 (Batch 4) - PR #30 CI GAGAL
│
├─ Status: OPEN
├─ Branch: feat/phase-2-batch-4-runtime-migration
├─ CI Check: quality-gates → FAILURE
│
└─ RULE: TIDAK LANJUT KE PHASE 3 SAMPAI PR #30 HIJAU
```

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

**Prioritas #1:** Fix CI failure PR #30

```
1. ✅ Fix issues (typecheck, lint, tests)
2. ✅ Local testing: pnpm typecheck, lint, build, test
3. ✅ Push update ke PR #30
4. ⏳ Tunggu CI hijau
5. Merge PR #30
6. BARU lanjut ke Phase 3
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
**Last Updated:** July 2026
**Next Review:** Setiap selesai batch
