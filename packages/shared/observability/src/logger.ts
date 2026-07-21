export class Logger {
  constructor(private context: string) {}

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        context: this.context,
        message,
        ...meta,
      }),
    );
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        context: this.context,
        message,
        ...meta,
      }),
    );
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        context: this.context,
        message,
        errorMessage: error?.message,
        errorStack: error?.stack,
        ...meta,
      }),
    );
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    console.debug(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        context: this.context,
        message,
        ...meta,
      }),
    );
  }
}
