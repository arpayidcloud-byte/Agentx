import { FileTooLargeError } from './errors.js';
export class FilesystemPolicy {
    config;
    constructor(config) {
        this.config = config;
    }
    getConfig() {
        return this.config;
    }
    isAllowed(realPath) {
        const pathParts = realPath.split('/').filter(Boolean);
        if (!this.config.allowHiddenFiles) {
            const hasHiddenPart = pathParts.some((part) => part.startsWith('.'));
            if (hasHiddenPart) {
                return false;
            }
        }
        return this.config.allow.some((pattern) => this.matchesPattern(realPath, pattern));
    }
    validateFileSize(sizeBytes) {
        if (sizeBytes > this.config.maxFileSizeBytes) {
            throw new FileTooLargeError(sizeBytes, this.config.maxFileSizeBytes);
        }
    }
    matchesPattern(filePath, pattern) {
        // Normalize both paths to relative from workspace root
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