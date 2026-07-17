import * as path from 'path';
import * as fs from 'fs/promises';
import { SandboxViolationError, AllowlistViolationError } from './errors.js';
export class FilesystemSandbox {
    workspaceRoot;
    pathResolver;
    policy;
    constructor(workspaceRoot, pathResolver, policy) {
        this.workspaceRoot = workspaceRoot;
        this.pathResolver = pathResolver;
        this.policy = policy;
    }
    async validateRead(requestPath) {
        return this.validateAccess(requestPath, 'read');
    }
    async validateWrite(requestPath) {
        return this.validateAccess(requestPath, 'write');
    }
    async validateAccess(requestPath, _operation) {
        if (!this.workspaceRoot) {
            throw new SandboxViolationError('Workspace root is not configured');
        }
        const resolvedPath = await this.pathResolver.resolve(this.workspaceRoot, requestPath);
        this.validateWorkspaceJail(resolvedPath);
        this.validateAllowlist(resolvedPath);
        const hiddenAllowed = this.policy.getConfig().allowHiddenFiles;
        if (!hiddenAllowed) {
            this.validateHiddenFilePolicy(resolvedPath);
        }
        return resolvedPath;
    }
    validateWorkspaceJail(realPath) {
        if (!realPath.startsWith(this.workspaceRoot)) {
            throw new SandboxViolationError(`Path "${realPath}" escapes workspace jail "${this.workspaceRoot}"`);
        }
    }
    async validateSymlinkEscape(realPath) {
        try {
            const stats = await fs.lstat(realPath);
            if (stats.isSymbolicLink()) {
                const target = await fs.realpath(realPath);
                this.validateWorkspaceJail(target);
            }
        }
        catch (err) {
            if (err instanceof Error && err.code === 'ENOENT') {
                return;
            }
            throw err;
        }
    }
    validateAllowlist(realPath) {
        // Check if path is relative to workspace root
        const relativePath = path.relative(this.workspaceRoot, realPath);
        if (!this.policy.isAllowed(relativePath) && !this.policy.isAllowed(realPath)) {
            throw new AllowlistViolationError(realPath);
        }
    }
    validateHiddenFilePolicy(realPath) {
        const parts = path.relative(this.workspaceRoot, realPath).split(path.sep);
        const hasHidden = parts.some(part => part.startsWith('.'));
        if (hasHidden) {
            throw new SandboxViolationError(`Path "${realPath}" accesses hidden files which is disabled in policy`);
        }
    }
}
//# sourceMappingURL=sandbox.js.map