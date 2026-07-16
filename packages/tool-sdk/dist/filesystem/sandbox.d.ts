import { ISandbox, IPathResolver, IFilesystemPolicy } from './interfaces.js';
export declare class FilesystemSandbox implements ISandbox {
    readonly workspaceRoot: string;
    private readonly pathResolver;
    private readonly policy;
    constructor(workspaceRoot: string, pathResolver: IPathResolver, policy: IFilesystemPolicy);
    validateRead(requestPath: string): Promise<string>;
    validateWrite(requestPath: string): Promise<string>;
    private validateAccess;
    validateWorkspaceJail(realPath: string): void;
    validateSymlinkEscape(realPath: string): Promise<void>;
    validateAllowlist(realPath: string): void;
    validateHiddenFilePolicy(realPath: string): void;
}
//# sourceMappingURL=sandbox.d.ts.map