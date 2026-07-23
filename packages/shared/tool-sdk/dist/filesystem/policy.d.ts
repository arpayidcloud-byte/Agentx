import type { IFilesystemPolicy, FilesystemConfig } from './interfaces.js';
export declare class FilesystemPolicy implements IFilesystemPolicy {
    private config;
    private allowedReadPatterns;
    private allowedWritePatterns;
    constructor(config: FilesystemConfig);
    getConfig(): FilesystemConfig;
    isAllowed(realPath: string, operation?: 'read' | 'write'): boolean;
    isReadAllowed(realPath: string): boolean;
    isWriteAllowed(realPath: string): boolean;
    validateFileSize(sizeBytes: number): void;
    private matchesPattern;
}
//# sourceMappingURL=policy.d.ts.map