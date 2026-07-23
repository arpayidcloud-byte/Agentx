import { PlannerAgent, ArchitectAgent, CoderAgent, ReviewerAgent, TesterAgent, SecurityAgent, } from './sub-agent.js';
import { DocumentationAgent, QAAgent } from './extended-agents.js';
export class SubAgentFactory {
    createAgent(role) {
        const id = `${role}-${Math.random().toString(36).substring(2, 9)}`;
        switch (role) {
            case 'planner':
                return new PlannerAgent(id);
            case 'architect':
                return new ArchitectAgent(id);
            case 'coder':
                return new CoderAgent(id);
            case 'reviewer':
                return new ReviewerAgent(id);
            case 'tester':
                return new TesterAgent(id);
            case 'security':
                return new SecurityAgent(id);
            case 'documentation':
                return new DocumentationAgent(id);
            case 'qa':
                return new QAAgent(id);
            default:
                throw new Error(`Unknown agent role: ${String(role)}`);
        }
    }
}
//# sourceMappingURL=sub-agent-factory.js.map