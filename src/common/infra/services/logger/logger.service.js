import Pino from "pino";
import { requestContext } from "@fastify/request-context";

import { appConfig, loggerConfig } from "#src/configs/index.js";

const PinoPrettyTransport = {
  target: "pino-pretty",
  options: {
    colorize: loggerConfig.enableColorizedPrint,
    levelFirst: true,
    ignore: "serviceContext",
    translateTime: "SYS:HH:MM:ss.l",
  },
};

const TerminalTransport = loggerConfig.enablePrettyPrint ? PinoPrettyTransport : undefined;

export const TerminalOptions = {
  level: loggerConfig.logLevel,

  base: {
    serviceContext: {
      service: appConfig.applicationName,
      version: appConfig.version,
    },
  },
  redact: {
    paths: ["pid", "hostname", "body.password"],
    remove: true,
  },
  transport: TerminalTransport,
};

/**
 * @typedef {'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'} LOG_LEVEL
 */

const loggerService = Pino(TerminalOptions);

export class LoggerService {
  contextName = "context";

  setContext = (name) => {
    this.contextName = name;
  };

  trace(message, context, ...args) {
    if (context) {
      loggerService.trace({ [this.contextName]: context }, message, ...args);
    } else {
      loggerService.trace(message, ...args);
    }
  }

  debug(message, context, ...args) {
    if (context) {
      loggerService.debug({ [this.contextName]: context }, message, ...args);
    } else {
      loggerService.debug(message, ...args);
    }
  }

  info(message, context, ...args) {
    if (context) {
      loggerService.info({ [this.contextName]: context }, message, ...args);
    } else {
      loggerService.info(message, ...args);
    }
  }

  warn(message, context, ...args) {
    if (context) {
      loggerService.warn({ [this.contextName]: context }, message, ...args);
    } else {
      loggerService.warn(message, ...args);
    }
  }

  error(message, trace, context, ...args) {
    if (context) {
      loggerService.error({ [this.contextName]: context, trace }, message, ...args);
    } else if (trace) {
      loggerService.error({ trace }, message, ...args);
    } else {
      loggerService.error(message, ...args);
    }
  }

  fatal(...args) {
    return loggerService.fatal(args);
  }

  child(biding, option) {
    return loggerService.child(biding, option);
  }
}

const Logger = new LoggerService();

// @ts-ignore
export const logger = requestContext.get("logger") ?? Logger;

export default Logger;
