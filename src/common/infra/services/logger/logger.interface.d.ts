/**
 * Interface representing a logger.
 */
export interface ILogger {
  /**
   * Name of the logger's context.
   */
  contextName: string;

  /**
   * Set the name of the logger's context.
   * @param name Name of the context.
   */
  setContext(name: string): void;

  /**
   * Log a trace message.
   * @param message The message to log.
   * @param context An optional context to include in the log.
   * @param args Optional additional arguments to include in the log.
   */
  trace(message: any, context?: string, ...args: any[]): void;

  /**
   * Log a debug message.
   * @param message The message to log.
   * @param context An optional context to include in the log.
   * @param args Optional additional arguments to include in the log.
   */
  debug(message: any, context?: string, ...args: any[]): void;

  /**
   * Log an info message.
   * @param message The message to log.
   * @param context An optional context to include in the log.
   * @param args Optional additional arguments to include in the log.
   */
  info(message: any, context?: string, ...args: any[]): void;

  /**
   * Log a warning message.
   * @param message The message to log.
   * @param context An optional context to include in the log.
   * @param args Optional additional arguments to include in the log.
   */
  warn(message: any, context?: string, ...args: any[]): void;

  /**
   * Log an error message.
   * @param message The message to log.
   * @param trace A stack trace to include in the log.
   * @param context An optional context to include in the log.
   * @param args Optional additional arguments to include in the log.
   */
  error(message: any, trace: any, context?: any, ...args: any[]): void;

  /**
   * Log a fatal error message.
   * @param args Optional additional arguments to include in the log.
   */
  fatal(...args: any[]): any;

  /**
   * Create a child logger.
   * @param biding A binding object for setting up the child logger.
   * @param option Optional configuration options for the child logger.
   */
  child(biding: any, option?: Record<string, any>): any;
}
