export class FilesystemValidator {
    validateEncoding(buffer) {
        const hasNullBytes = buffer.includes(0);
        if (hasNullBytes)
            return false;
        try {
            buffer.toString('utf-8');
            return true;
        }
        catch {
            return false;
        }
    }
    detectBinary(buffer) {
        if (buffer.length === 0)
            return false;
        const nullCount = Array.from(buffer).filter((byte) => byte === 0).length;
        const nullRatio = nullCount / buffer.length;
        if (nullRatio > 0.01)
            return true;
        const nonAsciiCount = Array.from(buffer).filter((byte) => byte > 127).length;
        const nonAsciiRatio = nonAsciiCount / buffer.length;
        return nonAsciiRatio > 0.3;
    }
    validateFilename(filename) {
        if (!filename || filename.length === 0)
            return false;
        if (filename.includes('\0'))
            return false;
        if (filename.includes('..'))
            return false;
        // eslint-disable-next-line no-control-regex -- Control chars \x00-\x1f intentionally matched for filename validation
        const invalidChars = /[<>:"|?*\x00-\x1f]/;
        return !invalidChars.test(filename);
    }
    validateDirectoryPath(dirPath) {
        return this.validateFilename(dirPath);
    }
}
//# sourceMappingURL=validator.js.map