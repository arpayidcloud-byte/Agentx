/**
 * @module workflow-orchestration/replanning-engine
 * @description Deterministic replanning engine.
 */

import type { WorkflowGraph } from './interfaces.js';

export class ReplanningEngine {
  replan(graph: WorkflowGraph, reason: string): WorkflowGraph {
    return { ...graph, timestamp: new Date() };
  }
}
