import type { ISandbox, IAtomicWriter, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';
export declare class FilesystemWriteTool {
    private readonly sandbox;
    private readonly atomicWriter;
    private readonly validator;
    private readonly policy;
    constructor(sandbox: ISandbox, atomicWriter: IAtomicWriter, validator: IFilesystemValidator, policy: IFilesystemPolicy);
    write(requestPath: string, content: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=write.d.ts.map