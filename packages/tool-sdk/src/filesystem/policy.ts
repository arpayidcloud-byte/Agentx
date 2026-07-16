import { IFilesystemPolicy, FilesystemConfig } from './interfaces.js';
import { FileTooLargeError } from './errors.js';

export class FilesystemPolicy implements IFilesystemPolicy {
  private config: FilesystemConfig;

  constructor(config: FilesystemConfig) {
    this.config = config;
  }

  public getConfig(): FilesystemConfig {
    return this.config;
  }

  public isAllowed(realPath: string): boolean {
    const pathParts = realPath.split('/').filter(Boolean);
    
    if (!this.config.allowHiddenFiles) {
      const hasHiddenPart = pathParts.some(part => part.startsWith('.'));
      if (hasHiddenPart) {
        return false;
      }
    }

    return this.config.allow.some(pattern => this.matchesPattern(realPath, pattern));
  }

  public validateFileSize(sizeBytes: number): void {
    if (sizeBytes > this.config.maxFileSizeBytes) {
      throw new FileTooLargeError(sizeBytes, this.config.maxFileSizeBytes);
    }
  }

  private matchesPattern(filePath: string, pattern: string): boolean {
    // Normalize both paths to relative from workspace root
    const normalizedPath = filePath.replace(/^\//, '');
    const normalizedPattern = pattern.replace(/^\//, '');
    
    const patternParts = normalizedPattern.split('/');
    const pathParts = normalizedPath.split('/');

    if (patternParts.length > pathParts.length) return false;

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]!;
      if (patternPart === '**') return true;
      if (!patternPart.includes('*')) {
        if (patternPart !== pathParts[i]) return false;
      } else {
        const regex = new RegExp('^' + patternPart.replace(/\*/g, '[^/]*') + '$');
        if (!regex.test(pathParts[i]!)) return false;
      }
    }

    return patternParts.length === pathParts.length;
  }
}
