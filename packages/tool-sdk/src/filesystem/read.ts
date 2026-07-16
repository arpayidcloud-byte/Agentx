import * as fs from 'fs/promises';

import { ISandbox, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';
import { InvalidEncodingError } from './errors.js';

export class FilesystemReadTool {
  constructor(
    private readonly sandbox: ISandbox,
    private readonly validator: IFilesystemValidator,
    private readonly policy: IFilesystemPolicy
  ) {}

  public async read(requestPath: string): Promise<{
    content: string;
    metadata: { size: number; isBinary: boolean };
  }> {
    const realPath = await this.sandbox.validateRead(requestPath);
    await this.sandbox.validateSymlinkEscape(realPath);
    
    const stats = await fs.stat(realPath);
    if (!stats.isFile()) {
      throw new Error(`Path "${realPath}" is not a file`);
    }
    
    this.policy.validateFileSize(stats.size);
    
    const buffer = await fs.readFile(realPath);
    const isBinary = this.validator.detectBinary(buffer);
    
    if (isBinary) {
      throw new InvalidEncodingError('Binary file detected and cannot be read as text');
    }

    const isValid = this.validator.validateEncoding(buffer);
    if (!isValid) {
      throw new InvalidEncodingError('Invalid UTF-8 encoding detected');
    }

    return {
      content: buffer.toString('utf-8'),
      metadata: { size: stats.size, isBinary: false }
    };
  }
}
