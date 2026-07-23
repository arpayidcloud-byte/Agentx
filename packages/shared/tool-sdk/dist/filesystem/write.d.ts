import type { ISandbox, IAtomicWriter, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';
export declare class FilesystemWriteTool {
    private readonly sandbox;
    private readonly atomicWriter;
    private readonly validator;
    private readonly policy;
    private readonly timeoutMs;
    constructor(sandbox: ISandbox, atomicWriter: IAtomicWriter, validator: IFilesystemValidator, policy: IFilesystemPolicy, timeoutMs?: number);
    write(requestPath: string, content: string): Promise<{
        success: boolean;
    }>;
    private withTimeout;
}
//# sourceMappingURL=write.d.ts.map