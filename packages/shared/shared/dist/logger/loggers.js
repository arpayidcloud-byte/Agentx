import { SecretRedactor } from '../redaction/redactor.js';
import { TraceContext } from '../trace/context.js';
export class BaseLogger {
    moduleName;
    config;
    boundContext;
    constructor(moduleName, config, boundContext = {}) {
        this.moduleName = moduleName;
        this.config = config;
        this.boundContext = boundContext;
    }
    trace(message, metadata, context) {
        this.log('TRACE', message, undefined, metadata, context);
    }
    debug(message, metadata, context) {
        this.log('DEBUG', message, undefined, metadata, context);
    }
    info(message, metadata, context) {
        this.log('INFO', message, undefined, metadata, context);
    }
    warn(message, metadata, context) {
        this.log('WARN', message, undefined, metadata, context);
    }
    error(message, error, metadata, context) {
        this.log('ERROR', message, error, metadata, context);
    }
    fatal(message, error, metadata, context) {
        this.log('FATAL', message, error, metadata, context);
    }
    log(level, message, error, metadata, context) {
        if (!this.shouldLog(level)) {
            return;
        }
        if (this.config.samplingRate !== undefined && this.config.samplingRate < 1.0) {
            if (Math.random() > this.config.samplingRate) {
                return;
            }
        }
        // Merge static context, bound context, dynamic context, and trace storage context
        const currentTrace = TraceContext.get() || {};
        const mergedContext = {
            ...currentTrace,
            ...this.boundContext,
            ...context,
        };
        let processedMetadata = metadata;
        let processedContext = mergedContext;
        let processedMessage = message;
        let processedError = error;
        if (this.config.enableRedaction) {
            processedMetadata = SecretRedactor.redact(metadata);
            processedContext = SecretRedactor.redact(mergedContext);
            processedMessage = SecretRedactor.redact(message);
            if (error) {
                processedError = SecretRedactor.redact(error);
            }
        }
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            module: this.moduleName,
            message: processedMessage,
            context: Object.keys(processedContext).length > 0 ? processedContext : undefined,
            metadata: processedMetadata,
            error: processedError
                ? {
                    message: processedError.message,
                    stack: processedError.stack,
                    code: processedError.code,
                }
                : undefined,
        };
        this.print(entry);
    }
    shouldLog(level) {
        const priorities = {
            TRACE: 0,
            DEBUG: 1,
            INFO: 2,
            WARN: 3,
            ERROR: 4,
            FATAL: 5,
        };
        return priorities[level] >= priorities[this.config.level];
    }
}
export class NullLogger {
    trace() { }
    debug() { }
    info() { }
    warn() { }
    error() { }
    fatal() { }
    withContext() {
        return this;
    }
    withModule() {
        return this;
    }
}
export class JsonLogger extends BaseLogger {
    constructor(moduleName, config, boundContext = {}) {
        super(moduleName, config, boundContext);
    }
    print(entry) {
        if (entry.level === 'ERROR' || entry.level === 'FATAL') {
            console.error(JSON.stringify(entry));
        }
        else if (entry.level === 'WARN') {
            console.warn(JSON.stringify(entry));
        }
        else {
            console.log(JSON.stringify(entry));
        }
    }
    withContext(context) {
        return new JsonLogger(this.moduleName, this.config, { ...this.boundContext, ...context });
    }
    withModule(moduleName) {
        return new JsonLogger(moduleName, this.config, this.boundContext);
    }
}
export class ConsoleLogger extends BaseLogger {
    constructor(moduleName, config, boundContext = {}) {
        super(moduleName, config, boundContext);
    }
    print(entry) {
        const colorMap = {
            TRACE: '\x1b[90m', // grey
            DEBUG: '\x1b[36m', // cyan
            INFO: '\x1b[32m', // green
            WARN: '\x1b[33m', // yellow
            ERROR: '\x1b[31m', // red
            FATAL: '\x1b[41m\x1b[37m', // red background
        };
        const reset = '\x1b[0m';
        const color = colorMap[entry.level] || '';
        const ctxString = entry.context ? ` [ctx:${JSON.stringify(entry.context)}]` : '';
        const metaString = entry.metadata ? ` [meta:${JSON.stringify(entry.metadata)}]` : '';
        const errString = entry.error
            ? `\nError: ${entry.error.message}\n${entry.error.stack || ''}`
            : '';
        const logLine = `${entry.timestamp} ${color}[${entry.level}]${reset} [${entry.module}] ${entry.message}${ctxString}${metaString}${errString}`;
        if (entry.level === 'ERROR' || entry.level === 'FATAL') {
            console.error(logLine);
        }
        else if (entry.level === 'WARN') {
            console.warn(logLine);
        }
        else {
            console.log(logLine);
        }
    }
    withContext(context) {
        return new ConsoleLogger(this.moduleName, this.config, { ...this.boundContext, ...context });
    }
    withModule(moduleName) {
        return new ConsoleLogger(moduleName, this.config, this.boundContext);
    }
}
//# sourceMappingURL=loggers.js.map