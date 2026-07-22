# AgentX Project Workflow

**Version:** 1.0
**Created:** July 2026
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
4. ORCHESTRATOR: Validate & Integrate
   │
   ├─ Collect results dari semua sub-agents
   ├─ Run typecheck, lint, build
   ├─ Run tests
   └─ Create PR
   │
   ↓
5. ORCHESTRATOR: CI Gate
   │
   ├─ CI hijau? → Merge, lanjut batch berikutnya
   └─ CI merah? → Fix, ulangi dari step 4
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
1. Diagnosa CI failure
2. Fix issues
3. Push update ke PR #30
4. Tunggu CI hijau
5. Merge PR #30
6. BARU lanjut ke Phase 3
```

---

**Document Owner:** Orchestrator
**Last Updated:** July 2026
**Next Review:** Setiap selesai batch
