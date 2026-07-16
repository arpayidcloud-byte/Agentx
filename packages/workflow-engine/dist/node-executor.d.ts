/**
 * @module workflow-engine/node-executor
 * @description NodeExecutor provides isolated execution logic for each node type.
 */
import { WorkflowNode } from './interfaces.js';
import { INodeExecutor } from './interfaces-v2.js';
export declare class NodeExecutor implements INodeExecutor {
    executeNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
    executeToolNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
    executeAgentNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
    executeApprovalNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
    executeParallelNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
    executeLoopNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
    executeConditionalNode(node: WorkflowNode, _context: Record<string, unknown>): Promise<unknown>;
}
//# sourceMappingURL=node-executor.d.ts.map