# AgentX Development Workflow

**Version:** 3.0 (Solo Dev Optimized)  
**Created:** July 24, 2026  
**Last Updated:** July 26, 2026  
**Status:** Active

---

## 🎯 Quick Start (Solo Dev)

**Untuk AI berikutnya yang接手 project ini:**

1. **Baca section ini dulu** → Kamu tahu context solo dev
2. **Scroll ke "📍 Current Status"** → Tahu apa yang harus dikerjakan
3. **Ikuti "🚀 Development Workflow"** → Step-by-step dari branch sampai merge
4. **Pakai MCP tools** → Sebelum coding, explore dulu
5. **Run CI lokal** → `./scripts/pre-pr-check.sh` sebelum push
6. **Merge sendiri** → Solo dev = self-review OK

---

## 📍 Current Status

**Phase 2: Security Hardening** (Week 3-4)

| Batch   | Task               | Status             | PR  | Notes          |
| ------- | ------------------ | ------------------ | --- | -------------- |
| 2.1     | JWT Authentication | ✅ Complete        | #54 | Merged         |
| 2.2     | RBAC Authorization | ✅ Complete        | #57 | Merged         |
| 2.3     | Rate Limiting      | ✅ Complete        | #57 | Merged         |
| **2.4** | **Security Audit** | **⬜ IN PROGRESS** | -   | **START HERE** |

### Next Task: Phase 2.4 - Security Audit

**What to implement:**

1. SAST scanner integration to CI
2. Secret detection pre-commit hook
3. Security audit API endpoints (`/api/v1/security/*`)
4. Vulnerability scan & fix (0 HIGH/CRITICAL)

**Files to create/modify:**

- `packages/api-server/src/routes/security.ts` (NEW)
- `.github/workflows/ci.yml` (ADD SAST step)
- `scripts/pre-commit-secret-detect.sh` (NEW)

**MCP commands before coding:**

```bash
search_graph(query="SAST scanner security")
search_graph(query="secret detector patterns")
get_code_snippet(qualified_name="root-Agentx.packages.shared.security.src.scanner.SASTScanner")
get_code_snippet(qualified_name="root-Agentx.packages.shared.security.src.secret-detector.SecretPatternDetector")
```

**Branch name:** `phase2-batch2.4-security-audit`

**Success criteria:**

- [ ] SAST scan runs in CI
- [ ] Secret detection pre-commit active
- [ ] Security API endpoints implemented
- [ ] 0 HIGH/CRITICAL vulnerabilities
- [ ] CI green before merge

---

## 🚀 Development Workflow (Step-by-Step)

### Step 1: Check Master Plan

Buka [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md), cari batch yang mau dikerjakan.

```bash
# Contoh: Phase 2.4 - Security Audit
# Read batch details, success criteria, files to modify
```

### Step 2: Create Branch

```bash
git checkout -b phase2-batch2.4-security-audit
```

**Naming convention:** `<phase>-<batch>-<description>`

### Step 3: MCP Exploration (REQUIRED)

**Sebelum coding, WAJIB pakai MCP tools:**

```bash
# 1. Understand architecture
get_architecture()

# 2. Find relevant code
search_graph(query="security audit SAST")

# 3. Trace dependencies
trace_path(function_name="SASTScanner", direction="both")

# 4. Read source code
get_code_snippet(qualified_name="root-Agentx.packages.shared.security.src.scanner.SASTScanner")

# 5. Complex queries (if needed)
query_graph(query="MATCH (n:Function) WHERE n.name CONTAINS 'security' RETURN n")
```

**Kapan pakai MCP:**

- ✅ Find function/class → `search_graph`
- ✅ Trace call graph → `trace_path`
- ✅ Read source → `get_code_snippet`
- ❌ Search string literal → Pakai `grep` (lebih cepat)
- ❌ Search config files → Pakai `grep` atau `glob`

### Step 4: Implement Changes

**Coding standards:**

```typescript
// ✅ DO: Use logger
import { logger } from '@agentx/shared';
logger.info('User authenticated', { userId });

// ❌ DON'T: console.log in production
console.log('User:', userId);

// ✅ DO: Environment variables
const API_URL = process.env.API_URL || 'http://localhost:3000';

// ❌ DON'T: Hardcoded values
const API_URL = 'http://localhost:3000';

// ✅ DO: Proper types
function processUser(user: User): Promise<Result> {}

// ❌ DON'T: any type
function processUser(user: any): any {}
```

### Step 5: Local Testing (MANDATORY)

**Sebelum commit/push, WAJIB run:**

```bash
./scripts/pre-pr-check.sh
```

Script ini akan run:

1. ✅ `pnpm typecheck` → Must pass
2. ✅ `pnpm lint` → Must pass (warnings OK)
3. ✅ `pnpm lint:deps` → No violations
4. ✅ `pnpm build` → Must pass
5. ✅ `pnpm test` → Must pass
6. ✅ `pnpm test:coverage` → Thresholds met
7. ✅ Check no console.log in production
8. ✅ Check no hardcoded secrets

**Jika ada yang fail → FIX DULU, jangan commit!**

### Step 6: Commit

```bash
git add .
git commit -m "feat(phase2-batch2.4): implement SAST scanner integration

- Add security scan step to CI workflow
- Use existing SASTScanner from @agentx/shared
- Run on every PR automatically

CI: ✅ All gates passed"
```

**Commit message format:** `<type>(<scope>): <description>`

### Step 7: Push

```bash
git push -u origin phase2-batch2.4-security-audit
```

### Step 8: Create PR

```bash
gh pr create --title "feat(phase2-batch2.4): Security Audit implementation" --body "
## Summary

Implement Phase 2.4 - Security Audit per MASTER_PLAN_PRODUCTION.md

## Changes

- SAST scanner integration to CI
- Secret detection pre-commit hook
- Security audit API endpoints
- Vulnerability scan & fix

## CI Status

- [ ] Typecheck ✅
- [ ] Lint ✅
- [ ] Build ✅
- [ ] Tests ✅
- [ ] Coverage ✅

## Checklist

- [ ] MCP exploration done
- [ ] Pre-PR check passed
- [ ] Documentation updated
"
```

### Step 9: Wait for CI

```bash
# Monitor CI status
gh pr checks <PR_NUMBER>

# Wait until all green:
# ✅ quality-gates PASS
```

**CI Jobs:**

1. typecheck
2. lint
3. lint:deps
4. build
5. test
6. coverage
7. security scan
8. handbook lint
9. contract tests

**Jika CI fail → FIX, push lagi, wait CI again**

### Step 10: Merge (Solo Dev = Self-Review)

Karena solo dev, self-review acceptable:

```bash
gh pr merge <PR_NUMBER> --merge
```

### Step 11: Update Documentation

Setelah merge, update progress:

```bash
# Edit WORKFLOW.md - mark batch complete
# Edit MASTER_PLAN_PRODUCTION.md - add PR link
git add WORKFLOW.md MASTER_PLAN_PRODUCTION.md
git commit -m "docs: mark Phase 2.4 complete (PR #XX)"
git push
```

### Step 12: Cleanup

```bash
# Delete branch
git branch -d phase2-batch2.4-security-audit
git push origin --delete phase2-batch2.4-security-audit

# Sync main
git checkout main
git pull origin main
```

---

## 📋 Core Principles

1. **Master Plan First** → Semua kerjaan refer ke MASTER_PLAN_PRODUCTION.md
2. **CI Gates** → No merge without green CI
3. **Small Batches** → PR <400 lines, frequent merges
4. **Documentation** → Code changes = doc updates
5. **Testing** → No feature without tests
6. **MCP-First** → MCP tools sebelum implementation
7. **Solo Dev** → Self-review OK, CI = primary gate

---

## 🛠️ MCP Tools Reference

### Available Tools

| Tool                         | Purpose             | When to Use            |
| ---------------------------- | ------------------- | ---------------------- |
| `get_architecture()`         | High-level overview | Start of new task      |
| `search_graph(query)`        | Find by pattern     | Find functions/classes |
| `search_graph(name_pattern)` | Find by name        | Exact name match       |
| `trace_path(function)`       | Trace dependencies  | Understand call graph  |
| `get_code_snippet(qn)`       | Read source         | Read specific function |
| `query_graph(cypher)`        | Complex queries     | Multi-hop patterns     |

### MCP vs Shell Tools

**Pakai MCP:**

- Find function/class definition
- Trace who calls what
- Understand architecture
- Code review

**Pakai Shell (grep/glob):**

- Search string literals
- Search error messages
- Count files
- Check git status

**Hybrid approach saves 80-90% tokens!**

---

## 🚨 CI Gates Rules

### Pre-PR Checklist (local)

Run `./scripts/pre-pr-check.sh`:

```
✅ pnpm typecheck    → 0 errors
✅ pnpm lint         → 0 errors (warnings OK)
✅ pnpm lint:deps    → No violations
✅ pnpm build        → 0 failures
✅ pnpm test         → 0 failures
✅ pnpm test:coverage → Thresholds met
✅ No console.log    → 0 in production code
✅ No hardcoded secrets → 0 found
```

### CI Pipeline (GitHub Actions)

Jobs (must all pass):

1. ✅ typecheck
2. ✅ lint
3. ✅ lint:deps
4. ✅ build
5. ✅ test
6. ✅ coverage (continue-on-error for pre-existing)
7. ✅ security scan
8. ✅ handbook lint (continue-on-error)
9. ✅ contract tests (continue-on-error)

**Merge Rules:**

- ✅ All green → Merge immediately
- ⚠️ Warnings only → Can merge
- ❌ Any failure → DO NOT MERGE, fix first

---

## 📊 Progress Tracking

### Update After Merge

**In WORKFLOW.md:**

```markdown
| 2.4 - Security Audit | ✅ Complete | #XX | Merged date |
```

**In MASTER_PLAN_PRODUCTION.md:**

```markdown
### Status

**COMPLETE** - PR #XX merged to main (YYYY-MM-DD)
```

**Commit:**

```bash
git commit -m "docs: mark Phase 2.4 complete (PR #XX)"
```

---

## 📝 Solo Dev Notes

### Self-Review Acceptable

Karena solo dev:

- ✅ Kamu write code
- ✅ Kamu review code
- ✅ Kamu merge
- ✅ CI green = sufficient quality gate

### When to Split PRs

**Keep PRs <400 lines.** Jika lebih besar, split:

```
Bad: 1 PR with 1000 lines
Good: 3 PRs with 300-350 lines each
```

**Split by feature:**

- PR 1: RBAC middleware
- PR 2: Rate limiting
- PR 3: CI improvements

### Security-Critical Code

Untuk auth/RBAC/secrets:

- Extra careful dengan implementation
- Double-check CI green
- Test thoroughly locally
- Consider waiting 1 session before merge (fresh eyes)

---

## 📎 Quick Reference

### Common Commands

```bash
# Start new task
git checkout main
git pull
git checkout -b phase2-batch2.4-description

# Before commit
./scripts/pre-pr-check.sh

# Commit & push
git add .
git commit -m "feat(scope): description"
git push -u origin <branch>

# Create PR
gh pr create --title "..." --body "..."

# Check CI
gh pr checks <PR_NUMBER>

# Merge (solo dev)
gh pr merge <PR_NUMBER> --merge

# Cleanup
git branch -d <branch>
git push origin --delete <branch>
```

### MCP Commands

```bash
# Before EVERY task
get_architecture()
search_graph(query="relevant pattern")
trace_path(function_name="TargetFunction")
get_code_snippet(qualified_name="full.path.Function")
```

### Branch Naming

```bash
phase0-batch0.1-remove-secrets
phase2-batch2.4-security-audit
phase3-batch3.1-llm-integration
```

---

## 📚 References

- [Master Production Plan](./MASTER_PLAN_PRODUCTION.md) - Main reference
- [Architecture](./ARCHITECTURE.md) - System design
- [Contributing](./CONTRIBUTING.md) - Contribution guide
- [Pre-PR Script](./scripts/pre-pr-check.sh) - Local CI

---

**Last Updated:** July 26, 2026  
**Next Review:** After Phase 2 complete  
**Owner:** Solo Developer  
**Status:** Active

---

## Appendix: Phase Timeline

```
Week 0:   Phase 0 - Cleanup & Security ✅ COMPLETE
Week 1-2: Phase 1 - Code Quality ✅ COMPLETE
Week 3-4: Phase 2 - Security Hardening ⬅️ CURRENT (2.4 IN PROGRESS)
Week 5-6: Phase 3 - Core Functionality ⬜ PENDING
Week 7-8: Phase 4 - Reliability ⬜ PENDING
Week 9-10: Phase 5 - Testing ⬜ PENDING
Week 11-12: Phase 6 - Performance ⬜ PENDING
Week 13-14: Phase 7 - Documentation ⬜ PENDING
Week 15-16: Phase 8 - Release ⬜ PENDING
```

See [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md) for detailed phase plans.
