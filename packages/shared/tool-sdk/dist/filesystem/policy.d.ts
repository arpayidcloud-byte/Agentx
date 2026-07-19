import type { IFilesystemPolicy, FilesystemConfig } from './interfaces.js';
export declare class FilesystemPolicy implements IFilesystemPolicy {
    private config;
    constructor(config: FilesystemConfig);
    getConfig(): FilesystemConfig;
    isAllowed(realPath: string): boolean;
    validateFileSize(sizeBytes: number): void;
    private matchesPattern;
}
//# sourceMappingURL=policy.d.ts.map