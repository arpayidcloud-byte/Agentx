/**
 * @module git/repository
 * @description Git repository detection and validation.
 * Detects git repositories, worktrees, detached HEAD, and bare repositories.
 */
import type { GitRepositoryInfo } from './interfaces.js';
/**
 * Creates a default repository info for non-git directories
 * @param path - The directory path
 * @returns GitRepositoryInfo with isGitRepository=false
 */
export declare function createNonGitRepositoryInfo(path: string): GitRepositoryInfo;
/**
 * Parses git repository info from git output
 * @param rootPath - Root path of the repository
 * @param gitDir - Git directory path
 * @param headContent - Content of HEAD file
 * @returns Parsed GitRepositoryInfo
 */
export declare function parseRepositoryInfo(rootPath: string, gitDir: string, headContent?: string): GitRepositoryInfo;
/**
 * Validates that a path is within the workspace
 * @param targetPath - Path to validate
 * @param workspaceRoot - Workspace root directory
 * @returns true if path is within workspace
 */
export declare function isWithinWorkspace(targetPath: string, workspaceRoot: string): boolean;
//# sourceMappingURL=repository.d.ts.map