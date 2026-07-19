/**
 * @module extended-agents
 * @description Extended agent roster beyond the v0.1 core.
 *
 * Volume 3 Ch. 2 specifies only 4 agents for the v0.1 core roster:
 *   - CoderAgent, ReviewerAgent, TesterAgent, SecurityAgent
 *
 * The following agents are extensions beyond v0.1, defined per RFC-0043
 * (cognitive domain). They are exported from this module rather than the
 * main index to keep the core roster clean.
 */

import { BaseSubAgent } from './sub-agent.js';
import type { AgentConfig } from './interfaces.js';

export class PlannerAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'planner', config);
  }
}

export class ArchitectAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'architect', config);
  }
}

export class DocumentationAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'documentation', config);
  }
}

export class QAAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig) {
    super(id, 'qa', config);
  }
}
