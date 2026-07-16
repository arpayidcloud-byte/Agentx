import * as fs from 'fs/promises';
import * as path from 'path';
import { AtomicWriteError } from './errors.js';
export class AtomicWriter {
    async write(filePath, content) {
        const dir = path.dirname(filePath);
        const tempDir = path.join(dir, '.atomic-temp');
        const tempFilePath = path.join(tempDir, `${path.basename(filePath)}.${Date.now()}.tmp`);
        try {
            await fs.mkdir(tempDir, { recursive: true });
            await fs.writeFile(tempFilePath, content, 'utf-8');
            await fs.rename(tempFilePath, filePath);
        }
        catch (error) {
            await this.cleanup(tempFilePath);
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new AtomicWriteError(errMsg, error instanceof Error ? error : undefined);
        }
        finally {
            await this.cleanupDirectory(tempDir);
        }
    }
    async rollback(tempFilePath) {
        await this.cleanup(tempFilePath);
    }
    async cleanup(filePath) {
        try {
            await fs.unlink(filePath);
        }
        catch {
            // Ignore cleanup failures
        }
    }
    async cleanupDirectory(dirPath) {
        try {
            const files = await fs.readdir(dirPath);
            if (files.length === 0) {
                await fs.rmdir(dirPath);
            }
        }
        catch {
            // Ignore cleanup failures
        }
    }
}
//# sourceMappingURL=atomic-writer.js.map