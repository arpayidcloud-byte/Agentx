/**
 * @module git/validator
 * @description Git command validation.
 * Validates branch names, refs, status output, and command rules.
 */
/** @description Validates git status output format */
export declare function validateStatusOutput(output: string): boolean;
/** @description Validates branch name format */
export declare function validateBranchName(name: string): boolean;
/** @description Validates git ref format */
export declare function validateRef(ref: string): boolean;
/** @description Validates commit message */
export declare function validateCommitMessage(message: string): boolean;
/** @description Detects dangerous git flags */
export declare function detectDangerousFlags(args: string[]): string[];
/** @description Detects force operations */
export declare function isForceOperation(args: string[]): boolean;
/** @description Detects orphan branch operations */
export declare function isOrphanBranch(args: string[]): boolean;
/** @description Detects empty commit operations */
export declare function isEmptyCommit(args: string[]): boolean;
//# sourceMappingURL=validator.d.ts.map