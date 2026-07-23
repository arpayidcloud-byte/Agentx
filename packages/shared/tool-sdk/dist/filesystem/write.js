import * as fs from 'fs/promises';
import * as path from 'path';
export class FilesystemWriteTool {
    sandbox;
    atomicWriter;
    validator;
    policy;
    timeoutMs;
    constructor(sandbox, atomicWriter, validator, policy, timeoutMs = 30000) {
        this.sandbox = sandbox;
        this.atomicWriter = atomicWriter;
        this.validator = validator;
        this.policy = policy;
        this.timeoutMs = timeoutMs;
    }
    async write(requestPath, content) {
        const realPath = await this.sandbox.validateWrite(requestPath);
        this.sandbox.validateSymlinkEscape(realPath);
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
            await this.withTimeout(fs.mkdir(dir, { recursive: true }));
        }
        catch (err) {
            if (err instanceof Error && err.code !== 'EEXIST') {
                throw err;
            }
        }
        await this.withTimeout(this.atomicWriter.write(realPath, content));
        return { success: true };
    }
    async withTimeout(promise) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Filesystem write timed out after ${this.timeoutMs}ms`)), this.timeoutMs)),
        ]);
    }
}
//# sourceMappingURL=write.js.map