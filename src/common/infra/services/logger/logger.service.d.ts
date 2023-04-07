import { ILogger } from "#services/logger/logger.interface";

export declare const TerminalOptions: {
  level: any;
  base: {
    serviceContext: {
      service: any;
      version: any;
    };
  };
  redact: {
    paths: string[];
    remove: boolean;
  };
  transport:
    | {
        target: string;
        options: {
          colorize: any;
          levelFirst: boolean;
          ignore: string;
          translateTime: string;
        };
      }
    | undefined;
};
export declare const LoggerTransport: any;
export declare class LoggerService implements ILogger {
  contextName: string;

  setContext(name: string): void;

  child(biding: Record<string, any>, option?: Record<string, any>): any;

  debug(message: any, context?: string, ...args: any[]): void;

  error(message: any, trace: any, context: any, ...args: any[]): void;

  fatal(...args: any[]): any;

  info(message: any, context?: string, ...args: any[]): void;

  trace(message: any, context?: string, ...args: any[]): void;

  warn(message: any, context?: string, ...args: any[]): void;
}

declare const Logger: LoggerService;

export declare const logger: any;
export default Logger;
export declare const fastifyRequestLogger: LoggerService;
