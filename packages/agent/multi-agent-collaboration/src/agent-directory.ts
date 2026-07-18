/**
 * @module multi-agent-collaboration/agent-directory
 * @description Agent capability and slot management.
 */

import { AgentDirectoryEntry, CapabilityMatch } from './interfaces.js';

export class AgentDirectory {
  private entries = new Map<string, AgentDirectoryEntry>();

  register(agentId: string, capabilities: string[], priority: number, slots: number): void {
    this.entries.set(agentId, {
      agentId,
      capabilities,
      priority,
      availableSlots: slots,
      currentLoad: 0,
    });
  }

  unregister(agentId: string): void {
    this.entries.delete(agentId);
  }

  allocate(agentId: string): boolean {
    const entry = this.entries.get(agentId);
    if (!entry || entry.availableSlots <= entry.currentLoad) return false;
    entry.currentLoad++;
    return true;
  }

  release(agentId: string): void {
    const entry = this.entries.get(agentId);
    if (entry && entry.currentLoad > 0) entry.currentLoad--;
  }

  discover(requiredCapabilities: string[]): CapabilityMatch {
    const matchedAgents: string[] = [];
    for (const [agentId, entry] of this.entries) {
      if (requiredCapabilities.every((cap) => entry.capabilities.includes(cap))) {
        matchedAgents.push(agentId);
      }
    }
    return {
      requiredCapabilities,
      availableCapabilities: Array.from(new Set(this.getAllCapabilities())),
      matchScore: matchedAgents.length > 0 ? 100 : 0,
      matchedAgents,
    };
  }

  getAllCapabilities(): string[] {
    const caps = new Set<string>();
    for (const entry of this.entries.values()) {
      entry.capabilities.forEach((c) => caps.add(c));
    }
    return Array.from(caps);
  }
}
