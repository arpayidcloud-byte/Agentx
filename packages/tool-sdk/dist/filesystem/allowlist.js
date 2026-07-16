import * as fs from 'fs/promises';
import * as yaml from 'yaml';
export class AllowlistConfigLoader {
    static defaultConfig = {
        allow: ['src/**', 'packages/**', 'docs/**', 'prisma/**'],
        maxFileSizeBytes: 10 * 1024 * 1024,
        allowHiddenFiles: false
    };
    static async loadFromConfig(configPath) {
        if (!configPath) {
            return AllowlistConfigLoader.defaultConfig;
        }
        try {
            const content = await fs.readFile(configPath, 'utf-8');
            const config = yaml.parse(content);
            if (config?.tools?.filesystem?.allow) {
                return {
                    allow: config.tools.filesystem.allow,
                    maxFileSizeBytes: config.tools.filesystem.maxFileSizeBytes || 10 * 1024 * 1024,
                    allowHiddenFiles: config.tools.filesystem.allowHiddenFiles ?? false
                };
            }
            return AllowlistConfigLoader.defaultConfig;
        }
        catch {
            return AllowlistConfigLoader.defaultConfig;
        }
    }
}
//# sourceMappingURL=allowlist.js.map