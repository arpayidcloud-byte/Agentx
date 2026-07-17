/**
 * @module workflow-orchestration/workflow-monitor
 * @description Monitors workflow execution state.
 */

import { WorkflowTask } from './interfaces.js';

export class WorkflowMonitor {
  private states = new Map<string, string>();

  updateState(taskId: string, state: string): void {
    this.states.set(taskId, state);
  }

  getState(taskId: string): string | undefined {
    return this.states.get(taskId);
  }

  getStateCount(state: string): number {
    return Array.from(this.states.values()).filter(s => s === state).length;
  }
}
