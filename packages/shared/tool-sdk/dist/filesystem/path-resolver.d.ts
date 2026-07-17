import { IPathResolver } from './interfaces.js';
export declare class PathResolver implements IPathResolver {
    private static readonly BLOCKED_DIRS;
    resolve(workspaceRoot: string, requestPath: string): Promise<string>;
    canonicalize(rawPath: string): string;
    detectTraversal(rawPath: string): void;
    resolveRealPath(absolutePath: string): Promise<string>;
    rejectInvalidPaths(rawPath: string): void;
    private checkBlockedDirs;
    validateWorkspaceJail(realPath: string, workspaceRoot: string): void;
    validateSymlinkEscape(realPath: string): void;
}
//# sourceMappingURL=path-resolver.d.ts.map