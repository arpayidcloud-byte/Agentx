import { JsonLogger, NullLogger, ConsoleLogger } from './loggers.js';
export class AgentXLoggerFactory {
    configuration = {
        level: 'INFO',
        format: 'json',
        enableRedaction: true,
        samplingRate: 1.0,
    };
    constructor() {
        this.loadFromEnv();
    }
    loadFromEnv() {
        const level = (process.env.AGENTX_LOG_LEVEL || 'info').toUpperCase();
        const format = (process.env.AGENTX_LOG_FORMAT || 'json');
        if (level) {
            this.configuration.level = level;
        }
        if (format) {
            this.configuration.format = format;
        }
    }
    configure(config) {
        this.configuration = { ...this.configuration, ...config };
    }
    createLogger(moduleName) {
        switch (this.configuration.format) {
            case 'pretty':
                return new ConsoleLogger(moduleName, this.configuration);
            case 'json':
                return new JsonLogger(moduleName, this.configuration);
            default:
                return new NullLogger();
        }
    }
}
//# sourceMappingURL=factory.js.map