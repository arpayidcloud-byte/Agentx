/**
 * @module approval/approval-registry
 * @description Approval registry for managing approval configurations.
 * Maps tool categories to approval requirements.
 */
import { ToolCategory } from '../interfaces/index.js';
import { ApprovalRegistryEntry } from './interfaces.js';
/**
 * Approval registry
 */
export declare class ApprovalRegistry {
    private entries;
    constructor();
    /**
     * Gets the approval entry for a category
     * @param category - Tool category
     * @returns ApprovalRegistryEntry or undefined
     */
    getEntry(category: ToolCategory): ApprovalRegistryEntry | undefined;
    /**
     * Registers a new approval entry
     * @param entry - The entry to register
     */
    registerEntry(entry: ApprovalRegistryEntry): void;
    /**
     * Gets the risk score for a category
     * @param category - Tool category
     * @returns Risk score or 0 if not found
     */
    getRiskScore(category: ToolCategory): number;
    /**
     * Checks if a category requires approval
     * @param category - Tool category
     * @returns true if approval is required
     */
    requiresApproval(category: ToolCategory): boolean;
}
//# sourceMappingURL=approval-registry.d.ts.map