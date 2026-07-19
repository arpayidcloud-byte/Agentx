import * as fs from 'fs/promises';
import { InvalidEncodingError } from './errors.js';
export class FilesystemReadTool {
    sandbox;
    validator;
    policy;
    constructor(sandbox, validator, policy) {
        this.sandbox = sandbox;
        this.validator = validator;
        this.policy = policy;
    }
    async read(requestPath) {
        const realPath = await this.sandbox.validateRead(requestPath);
        this.sandbox.validateSymlinkEscape(realPath);
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
            metadata: { size: stats.size, isBinary: false },
        };
    }
}
//# sourceMappingURL=read.js.map