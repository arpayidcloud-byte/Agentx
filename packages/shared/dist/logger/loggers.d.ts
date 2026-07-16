import { ILogger, LogLevel, LogContext, LogEntry, LoggerConfiguration } from './interfaces.js';
export declare abstract class BaseLogger implements ILogger {
    protected readonly moduleName: string;
    protected readonly config: LoggerConfiguration;
    protected readonly boundContext: LogContext;
    protected constructor(moduleName: string, config: LoggerConfiguration, boundContext?: LogContext);
    abstract print(entry: LogEntry): void;
    trace(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
    debug(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
    info(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
    warn(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
    error(message: string, error?: Error, metadata?: Record<string, unknown>, context?: LogContext): void;
    fatal(message: string, error?: Error, metadata?: Record<string, unknown>, context?: LogContext): void;
    abstract withContext(context: LogContext): ILogger;
    abstract withModule(moduleName: string): ILogger;
    protected log(level: LogLevel, message: string, error?: Error, metadata?: Record<string, unknown>, context?: LogContext): void;
    private shouldLog;
}
export declare class NullLogger implements ILogger {
    trace(): void;
    debug(): void;
    info(): void;
    warn(): void;
    error(): void;
    fatal(): void;
    withContext(): ILogger;
    withModule(): ILogger;
}
export declare class JsonLogger extends BaseLogger {
    constructor(moduleName: string, config: LoggerConfiguration, boundContext?: LogContext);
    print(entry: LogEntry): void;
    withContext(context: LogContext): ILogger;
    withModule(moduleName: string): ILogger;
}
export declare class ConsoleLogger extends BaseLogger {
    constructor(moduleName: string, config: LoggerConfiguration, boundContext?: LogContext);
    print(entry: LogEntry): void;
    withContext(context: LogContext): ILogger;
    withModule(moduleName: string): ILogger;
}
//# sourceMappingURL=loggers.d.ts.map