import type { ISandbox, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';
export declare class FilesystemReadTool {
    private readonly sandbox;
    private readonly validator;
    private readonly policy;
    constructor(sandbox: ISandbox, validator: IFilesystemValidator, policy: IFilesystemPolicy);
    read(requestPath: string): Promise<{
        content: string;
        metadata: {
            size: number;
            isBinary: boolean;
        };
    }>;
}
//# sourceMappingURL=read.d.ts.map