import * as fs from 'fs/promises';
import { InvalidEncodingError } from './errors.js';
export class FilesystemReadTool {
    sandbox;
    validator;
    policy;
    timeoutMs;
    constructor(sandbox, validator, policy, timeoutMs = 30000) {
        this.sandbox = sandbox;
        this.validator = validator;
        this.policy = policy;
        this.timeoutMs = timeoutMs;
    }
    async read(requestPath) {
        const realPath = await this.sandbox.validateRead(requestPath);
        this.sandbox.validateSymlinkEscape(realPath);
        const stats = await this.withTimeout(fs.stat(realPath));
        if (!stats.isFile()) {
            throw new Error(`Path "${realPath}" is not a file`);
        }
        this.policy.validateFileSize(stats.size);
        const buffer = await this.withTimeout(fs.readFile(realPath));
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
            metadata: { size: stats.size, isBinary: false },
        };
    }
    async withTimeout(promise) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Filesystem read timed out after ${this.timeoutMs}ms`)), this.timeoutMs)),
        ]);
    }
}
//# sourceMappingURL=read.js.map