import { IFilesystemValidator } from './interfaces.js';

export class FilesystemValidator implements IFilesystemValidator {
  public validateEncoding(buffer: Buffer): boolean {
    const hasNullBytes = buffer.includes(0);
    if (hasNullBytes) return false;
    try { buffer.toString('utf-8'); return true; } catch { return false; }
  }

  public detectBinary(buffer: Buffer): boolean {
    if (buffer.length === 0) return false;
    
    const nullCount = Array.from(buffer).filter(byte => byte === 0).length;
    const nullRatio = nullCount / buffer.length;
    
    if (nullRatio > 0.01) return true;
    
    const nonAsciiCount = Array.from(buffer).filter(byte => byte > 127).length;
    const nonAsciiRatio = nonAsciiCount / buffer.length;
    
    return nonAsciiRatio > 0.3;
  }

  public validateFilename(filename: string): boolean {
    if (!filename || filename.length === 0) return false;
    if (filename.includes('\0')) return false;
    if (filename.includes('..')) return false;
    
    const invalidChars = /[<>:"|?*\x00-\x1f]/;
    return !invalidChars.test(filename);
  }

  public validateDirectoryPath(dirPath: string): boolean {
    return this.validateFilename(dirPath);
  }
}
