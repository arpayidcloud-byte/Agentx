/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { IFilesystemValidator } from './interfaces.js';
export declare class FilesystemValidator implements IFilesystemValidator {
    validateEncoding(buffer: Buffer): boolean;
    detectBinary(buffer: Buffer): boolean;
    validateFilename(filename: string): boolean;
    validateDirectoryPath(dirPath: string): boolean;
}
//# sourceMappingURL=validator.d.ts.map