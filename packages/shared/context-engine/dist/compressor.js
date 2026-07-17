export class ContextCompressor {
    compress(data, ratio) {
        if (ratio >= 1.0)
            return { ...data };
        // Simple compression: remove nulls, undefined, and truncate long strings
        const result = {};
        for (const [key, value] of Object.entries(data)) {
            if (value === null || value === undefined)
                continue;
            if (typeof value === 'string' && value.length > 100) {
                result[key] = value.substring(0, Math.floor(value.length * ratio)) + '...';
            }
            else if (Array.isArray(value)) {
                result[key] = value.slice(0, Math.max(1, Math.floor(value.length * ratio)));
            }
            else if (typeof value === 'object') {
                result[key] = this.compress(value, ratio);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
}
//# sourceMappingURL=compressor.js.map