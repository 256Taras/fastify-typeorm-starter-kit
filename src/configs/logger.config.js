import { appConfig } from "#src/configs/app.config.js";

import { env } from "../../configs/env.js";

export const loggerConfig = {
  logLevel: env.LOG_LEVEL,
  enablePrettyPrint: env.ENABLE_PRETTY_LOG === 1,
  enableColorizedPrint: env.ENABLE_COLORIZED_LOG === 1,
  enableRequestLogging: true,
  enableResponseBodyLogging: appConfig.env !== "production" && env.ENABLE_RESPONSE_LOGGING_BODY === 1,
  enablePersistenceForceLogging: env.ENABLE_PERSISTENCE_FORCE_LOGGING === 1,
};
