/**
 * @module approval/approval-context
 * @description Approval context for execution.
 * Provides context information needed for approval and execution.
 */
import type { ApprovalExecutionContext } from './interfaces.js';
/**
 * Creates an approval execution context
 * @param params - Context parameters
 * @returns ApprovalExecutionContext
 */
export declare function createApprovalContext(params: {
    requestId: string;
    request: any;
    workspaceRoot: string;
    taskId: string;
    traceId: string;
    agentRole: string;
}): ApprovalExecutionContext;
/**
 * Validates an approval execution context
 * @param context - The context to validate
 * @returns true if valid
 */
export declare function validateApprovalContext(context: ApprovalExecutionContext): boolean;
//# sourceMappingURL=approval-context.d.ts.map