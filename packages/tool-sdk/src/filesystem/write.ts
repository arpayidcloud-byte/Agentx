import * as fs from 'fs/promises';
import * as path from 'path';
import { ISandbox, IAtomicWriter, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';

export class FilesystemWriteTool {
  constructor(
    private readonly sandbox: ISandbox,
    private readonly atomicWriter: IAtomicWriter,
    private readonly validator: IFilesystemValidator,
    private readonly policy: IFilesystemPolicy
  ) {}

  public async write(requestPath: string, content: string): Promise<{ success: boolean }> {
    const realPath = await this.sandbox.validateWrite(requestPath);
    await this.sandbox.validateSymlinkEscape(realPath);
    
    const contentBuffer = Buffer.from(content, 'utf-8');
    
    if (this.validator.detectBinary(contentBuffer)) {
      throw new Error('Content contains binary data which cannot be written as text');
    }

    if (!this.validator.validateEncoding(contentBuffer)) {
      throw new Error('Content contains invalid UTF-8 encoding');
    }

    this.policy.validateFileSize(contentBuffer.length);
    
    const dir = path.dirname(realPath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      if (err instanceof Error && (err as any).code !== 'EEXIST') {
        throw err;
      }
    }

    await this.atomicWriter.write(realPath, content);
    return { success: true };
  }
}
