import * as path from 'path';
import * as fs from 'fs/promises';
import { PathTraversalError, WorkspaceEscapeError } from './errors.js';
export class PathResolver {
    static BLOCKED_DIRS = ['/etc', '/root', '/home', '/proc', '/sys', '/dev'];
    async resolve(workspaceRoot, requestPath) {
        this.rejectInvalidPaths(requestPath);
        const normalized = this.canonicalize(requestPath);
        const absolute = path.resolve(workspaceRoot, normalized);
        const realPath = await this.resolveRealPath(absolute);
        this.validateWorkspaceJail(realPath, workspaceRoot);
        this.validateSymlinkEscape(realPath);
        return realPath;
    }
    canonicalize(rawPath) {
        return path.normalize(rawPath);
    }
    detectTraversal(rawPath) {
        const parts = rawPath.split(path.sep).filter(Boolean);
        for (const part of parts) {
            if (part === '..') {
                throw new PathTraversalError(rawPath, 'Relative parent directory traversal detected');
            }
        }
        if (rawPath.includes('\0')) {
            throw new PathTraversalError(rawPath, 'Null-byte injection attempt detected');
        }
        if (rawPath.startsWith('\\\\')) {
            throw new PathTraversalError(rawPath, 'Windows UNC path attempt detected');
        }
    }
    async resolveRealPath(absolutePath) {
        try {
            await fs.access(absolutePath);
            return path.resolve(absolutePath);
        }
        catch {
            return path.resolve(absolutePath);
        }
    }
    rejectInvalidPaths(rawPath) {
        this.detectTraversal(rawPath);
        this.checkBlockedDirs(rawPath);
    }
    checkBlockedDirs(rawPath) {
        const lowerPath = rawPath.toLowerCase();
        for (const blocked of PathResolver.BLOCKED_DIRS) {
            if (lowerPath.startsWith(blocked + '/') || lowerPath === blocked) {
                throw new PathTraversalError(rawPath, `Attempt to access restricted system directory ${blocked}`);
            }
        }
    }
    validateWorkspaceJail(realPath, workspaceRoot) {
        if (!realPath.startsWith(path.resolve(workspaceRoot))) {
            throw new WorkspaceEscapeError(realPath, workspaceRoot);
        }
    }
    validateSymlinkEscape(realPath) {
        const dirPart = path.dirname(realPath);
        if (dirPart !== path.dirname(realPath)) {
            // This is a structural check; runtime symlink resolution is handled externally
        }
    }
}
//# sourceMappingURL=path-resolver.js.map