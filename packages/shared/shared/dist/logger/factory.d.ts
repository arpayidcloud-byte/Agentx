import type { ILogger, LoggerConfiguration, LoggerFactory } from './interfaces.js';
export declare class AgentXLoggerFactory implements LoggerFactory {
    private configuration;
    constructor();
    private loadFromEnv;
    configure(config: Partial<LoggerConfiguration>): void;
    createLogger(moduleName: string): ILogger;
}
//# sourceMappingURL=factory.d.ts.map