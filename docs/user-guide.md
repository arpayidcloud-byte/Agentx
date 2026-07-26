# AgentX User Guide

**Version:** 1.0  
**Created:** July 26, 2026  
**Status:** Active

---

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/arpayidcloud-byte/Agentx.git
cd Agentx

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Build
pnpm build

# Run tests
pnpm test
```

### Configuration

**Required Environment Variables:**

```bash
# LLM Providers
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database (optional for in-memory)
DATABASE_URL=postgresql://...

# Redis (optional for distributed)
REDIS_URL=redis://localhost:6379
```

---

## CLI Commands

### Submit Task

```bash
# Submit a coding task
pnpm agentx submit "Create a REST API for user management" --role coder

# Submit a review task
pnpm agentx submit "Review this code for security issues" --role reviewer

# Submit a testing task
pnpm agentx submit "Write unit tests for auth module" --role tester
```

### Check Status

```bash
# List all tasks
pnpm agentx status

# Check specific task
pnpm agentx status <task-id>
```

### Approve/Reject

```bash
# Approve pending task
pnpm agentx approve <task-id>

# Reject pending task
pnpm agentx reject <task-id>
```

### Dead Letter Queue

```bash
# List failed tasks
pnpm agentx dlq list

# Check DLQ size
pnpm agentx dlq size

# Clear DLQ
pnpm agentx dlq clear
```

### Demo Mode

```bash
# Run E2E demo
pnpm agentx demo "Explain what is AgentX"

# Custom demo
pnpm agentx demo "Write a Python function"
```

---

## Agent Roles

### Coder Agent

**Responsibilities:**

- Write production code
- Implement features
- Fix bugs
- Refactor code

**Example:**

```bash
pnpm agentx submit "Implement JWT authentication" --role coder
```

### Reviewer Agent

**Responsibilities:**

- Code review
- Security analysis
- Best practices check
- Performance review

**Example:**

```bash
pnpm agentx submit "Review PR #123 for security issues" --role reviewer
```

### Tester Agent

**Responsibilities:**

- Write unit tests
- Integration tests
- Edge case coverage
- Test documentation

**Example:**

```bash
pnpm agentx submit "Write tests for payment module" --role tester
```

### Security Agent

**Responsibilities:**

- Vulnerability scanning
- Security audit
- OWASP Top 10 checks
- Compliance review

**Example:**

```bash
pnpm agentx submit "Audit authentication flow for vulnerabilities" --role security
```

---

## Task Lifecycle

```
CREATED → QUEUED → RUNNING → COMPLETED
                ↓
            FAILED → RETRYING
                ↓
            CANCELLED
```

### Task States

| State            | Description       | Action               |
| ---------------- | ----------------- | -------------------- |
| CREATED          | Task created      | Waiting to be queued |
| QUEUED           | In queue          | Waiting for agent    |
| RUNNING          | Being executed    | In progress          |
| WAITING_APPROVAL | Needs approval    | User action required |
| COMPLETED        | Successfully done | Review output        |
| FAILED           | Execution failed  | Check error, retry   |
| CANCELLED        | Manually stopped  | No action needed     |

---

## API Reference

### Submit Task

**POST** `/api/v1/tasks/submit`

```json
{
  "goal": "Create user registration endpoint",
  "role": "coder",
  "priority": "normal",
  "metadata": {
    "project": "auth-service"
  }
}
```

**Response:**

```json
{
  "taskId": "task-abc123",
  "status": "CREATED",
  "createdAt": "2026-07-26T17:00:00Z"
}
```

### Get Task

**GET** `/api/v1/tasks/:taskId`

**Response:**

```json
{
  "id": "task-abc123",
  "goal": "Create user registration endpoint",
  "status": "RUNNING",
  "assignedAgent": "coder-1",
  "progress": 45,
  "result": null
}
```

### List Tasks

**GET** `/api/v1/tasks`

**Query Parameters:**

- `status` - Filter by status
- `role` - Filter by agent role
- `limit` - Max results (default: 20)

### Approve Task

**POST** `/api/v1/tasks/:taskId/approve`

### Reject Task

**POST** `/api/v1/tasks/:taskId/reject`

---

## Best Practices

### Writing Effective Goals

✅ **DO:**

```
"Create a REST API endpoint for user registration with email validation"
```

❌ **DON'T:**

```
"Make a thing for users"
```

### Providing Context

✅ **DO:**

```bash
pnpm agentx submit "Fix login bug" --role coder
# Then provide context in follow-up
```

❌ **DON'T:**

```bash
pnpm agentx submit "Fix it" --role coder
# No context provided
```

### Reviewing Output

1. **Review code quality**
   - Check for best practices
   - Verify error handling
   - Ensure test coverage

2. **Test functionality**
   - Run provided tests
   - Manual testing if needed
   - Check edge cases

3. **Provide feedback**
   - Approve if satisfactory
   - Reject with clear feedback if issues

---

## Troubleshooting

### Task Stuck in QUEUED

**Cause:** No available agents

**Solution:**

1. Check agent status: `pnpm agentx status`
2. Wait for other tasks to complete
3. Consider scaling agents

### Task Failed

**Cause:** Execution error

**Solution:**

1. Check error message: `pnpm agentx status <task-id>`
2. Review task context
3. Retry with more context
4. Check DLQ: `pnpm agentx dlq list`

### LLM Provider Errors

**Cause:** API key issues or rate limits

**Solution:**

1. Verify API keys in `.env`
2. Check provider status pages
3. Wait for rate limit reset
4. Switch to fallback provider

---

## Examples

### Full Workflow Example

```bash
# 1. Submit coding task
pnpm agentx submit "Create user authentication API" --role coder

# 2. Check status
pnpm agentx status

# 3. Review output
pnpm agentx status <task-id>

# 4. Approve or request changes
pnpm agentx approve <task-id>

# 5. Submit testing task
pnpm agentx submit "Write tests for auth API" --role tester

# 6. Submit security review
pnpm agentx submit "Audit auth API for vulnerabilities" --role security
```

### Multi-Agent Collaboration

```bash
# Coder implements feature
pnpm agentx submit "Implement payment processing" --role coder

# Reviewer reviews code
pnpm agentx submit "Review payment code" --role reviewer

# Tester writes tests
pnpm agentx submit "Test payment module" --role tester

# Security audits
pnpm agentx submit "Audit payment security" --role security
```

---

## Support

- **Documentation:** https://docs.agentx.io
- **Issues:** https://github.com/arpayidcloud-byte/Agentx/issues
- **Discord:** https://discord.gg/agentx
- **Email:** support@agentx.io

---

**Last Updated:** July 26, 2026  
**Version:** 1.0.0
