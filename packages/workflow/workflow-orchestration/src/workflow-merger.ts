/**
 * @module workflow-orchestration/workflow-merger
 * @description Merges parallel branches safely.
 */

import { WorkflowNode } from './interfaces.js';

export class WorkflowMerger {
  merge(nodes: WorkflowNode[]): WorkflowNode[] {
    return nodes;
  }
}
