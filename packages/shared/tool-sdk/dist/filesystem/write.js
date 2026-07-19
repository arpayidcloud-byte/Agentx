import * as fs from 'fs/promises';
import * as path from 'path';
export class FilesystemWriteTool {
    sandbox;
    atomicWriter;
    validator;
    policy;
    constructor(sandbox, atomicWriter, validator, policy) {
        this.sandbox = sandbox;
        this.atomicWriter = atomicWriter;
        this.validator = validator;
        this.policy = policy;
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
            await fs.mkdir(dir, { recursive: true });
        }
        catch (err) {
            if (err instanceof Error && err.code !== 'EEXIST') {
                throw err;
            }
        }
        await this.atomicWriter.write(realPath, content);
        return { success: true };
    }
}
//# sourceMappingURL=write.js.map