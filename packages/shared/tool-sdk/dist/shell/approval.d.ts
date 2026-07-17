/**
 * @module shell/approval
 * @description Approval classification for shell commands.
 * Implements ADR-0005: shell.build = Risk 50 (Potentially Destructive),
 * shell.exec = Risk 90 (Destructive).
 */
import { ApprovalClassification, ParsedCommand } from './interfaces.js';
/**
 * Classifies a shell command for approval requirements
 * @param parsed - The parsed command
 * @param category - The tool category (shell.build or shell.exec)
 * @returns Approval classification with risk score
 */
export declare function classifyCommand(_parsed: ParsedCommand, category: 'shell.build' | 'shell.exec'): ApprovalClassification;
//# sourceMappingURL=approval.d.ts.map