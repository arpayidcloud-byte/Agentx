import { FileTooLargeError } from './errors.js';
export class FilesystemPolicy {
    config;
    allowedReadPatterns;
    allowedWritePatterns;
    constructor(config) {
        this.config = config;
        this.allowedReadPatterns = config.allowedReadPatterns || config.allow || [];
        this.allowedWritePatterns = config.allowedWritePatterns || config.allow || [];
    }
    getConfig() {
        return this.config;
    }
    isAllowed(realPath, operation) {
        const pathParts = realPath.split('/').filter(Boolean);
        if (!this.config.allowHiddenFiles) {
            const hasHiddenPart = pathParts.some((part) => part.startsWith('.'));
            if (hasHiddenPart) {
                return false;
            }
        }
        const patterns = operation === 'write' ? this.allowedWritePatterns : this.allowedReadPatterns;
        return patterns.some((pattern) => this.matchesPattern(realPath, pattern));
    }
    isReadAllowed(realPath) {
        return this.isAllowed(realPath, 'read');
    }
    isWriteAllowed(realPath) {
        return this.isAllowed(realPath, 'write');
    }
    validateFileSize(sizeBytes) {
        if (sizeBytes > this.config.maxFileSizeBytes) {
            throw new FileTooLargeError(sizeBytes, this.config.maxFileSizeBytes);
        }
    }
    matchesPattern(filePath, pattern) {
        const normalizedPath = filePath.replace(/^\//, '');
        const normalizedPattern = pattern.replace(/^\//, '');
        const patternParts = normalizedPattern.split('/');
        const pathParts = normalizedPath.split('/');
        if (patternParts.length > pathParts.length)
            return false;
        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];
            if (patternPart === '**')
                return true;
            if (!patternPart.includes('*')) {
                if (patternPart !== pathPart)
                    return false;
            }
            else {
                const regex = new RegExp('^' + patternPart.replace(/\*/g, '[^/]*') + '$');
                if (!regex.test(pathPart))
                    return false;
            }
        }
        return patternParts.length === pathParts.length;
    }
}
//# sourceMappingURL=policy.js.map