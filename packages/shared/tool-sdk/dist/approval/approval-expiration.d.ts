/**
 * @module approval/approval-expiration
 * @description Approval expiration management.
 * Handles TTL checks and automatic expiration of approval requests.
 */
import { ApprovalRequest, ExpirationCheckResult } from './interfaces.js';
/**
 * Checks if an approval request has expired
 * @param request - The approval request to check
 * @returns ExpirationCheckResult with time remaining
 */
export declare function checkExpiration(request: ApprovalRequest): ExpirationCheckResult;
/**
 * Checks if an approval request is still valid (not expired and in waiting state)
 * @param request - The approval request to check
 * @returns true if the request is still valid
 */
export declare function isRequestValid(request: ApprovalRequest): boolean;
/**
 * Gets the remaining time in a human-readable format
 * @param timeRemainingMs - Time remaining in milliseconds
 * @returns Human-readable string (e.g., "14 minutes 30 seconds")
 */
export declare function formatTimeRemaining(timeRemainingMs: number): string;
//# sourceMappingURL=approval-expiration.d.ts.map