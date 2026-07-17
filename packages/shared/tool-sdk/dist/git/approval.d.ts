/**
 * @module git/approval
 * @description Approval classification for git operations.
 * Implements risk-based classification per Volume 7 and ADR-0005.
 */
import { GitOperation, GitApprovalClassification } from './interfaces.js';
/**
 * Classifies a git operation for approval requirements
 * @param operation - The git operation
 * @returns Approval classification with risk score
 */
export declare function classifyGitOperation(operation: GitOperation): GitApprovalClassification;
//# sourceMappingURL=approval.d.ts.map