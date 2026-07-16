/**
 * @module multi-agent-reasoning/infrastructure/registry/AgentSelectionEngine
 * @description Selects optimal agent for task delegation.
 */

import { AgentDirectoryEntry } from '../../domain/collaboration/interfaces.js';

export class AgentSelectionEngine {
  selectBestCandidate(entries: AgentDirectoryEntry[], requiredCapabilities: string[]): AgentDirectoryEntry | null {
    const candidates = entries.filter(e => requiredCapabilities.every(cap => e.capabilities.includes(cap)));
    if (candidates.length === 0) return null;
    return candidates.sort((a, b) => {
      if (b.availableSlots - b.currentLoad !== a.availableSlots - a.currentLoad) {
        return (b.availableSlots - b.currentLoad) - (a.availableSlots - a.currentLoad);
      }
      return b.priority - a.priority;
    })[0];
  }
}
