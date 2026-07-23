import type { ISandbox, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';
export declare class FilesystemReadTool {
    private readonly sandbox;
    private readonly validator;
    private readonly policy;
    private readonly timeoutMs;
    constructor(sandbox: ISandbox, validator: IFilesystemValidator, policy: IFilesystemPolicy, timeoutMs?: number);
    read(requestPath: string): Promise<{
        content: string;
        metadata: {
            size: number;
            isBinary: boolean;
        };
    }>;
    private withTimeout;
}
//# sourceMappingURL=read.d.ts.map