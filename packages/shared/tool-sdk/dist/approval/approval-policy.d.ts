/**
 * @module approval/approval-policy
 * @description Approval policy configuration and risk classification.
 * Implements risk-based approval policies per Volume 7 and ADR-0005.
 */
import { ApprovalPolicyConfig, RiskLevel } from './interfaces.js';
/**
 * Creates an approval policy with defaults
 * @param config - Partial configuration to override defaults
 * @returns Merged ApprovalPolicyConfig
 */
export declare function createApprovalPolicy(config?: Partial<ApprovalPolicyConfig>): ApprovalPolicyConfig;
/**
 * Determines if a risk score requires auto-approval
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if auto-approval is sufficient
 */
export declare function requiresAutoApproval(riskScore: number, policy: ApprovalPolicyConfig): boolean;
/**
 * Determines if a risk score requires manual approval
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if manual approval is required
 */
export declare function requiresManualApproval(riskScore: number, policy: ApprovalPolicyConfig): boolean;
/**
 * Determines if a risk score requires double confirmation
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if double confirmation is required
 */
export declare function requiresDoubleConfirmation(riskScore: number, policy: ApprovalPolicyConfig): boolean;
/**
 * Classifies a risk score into a risk level
 * @param riskScore - Risk score (0-100)
 * @returns Risk level classification
 */
export declare function classifyRiskLevel(riskScore: number): RiskLevel;
/**
 * Determines if an approval is required for a risk score
 * @param riskScore - Risk score (0-100)
 * @param policy - Policy configuration
 * @returns true if approval is required
 */
export declare function isApprovalRequired(riskScore: number, policy: ApprovalPolicyConfig): boolean;
//# sourceMappingURL=approval-policy.d.ts.map