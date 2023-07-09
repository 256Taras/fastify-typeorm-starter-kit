import { logger } from "#services/logger/logger.service.js";

export class DatabaseLoggerService {
  logQuery(query, parameters) {
    logger.debug(query);
    logger.debug(parameters);
  }
  logQueryError(error, query, parameters) {
    logger.error({ error, query, parameters });
  }
  logQuerySlow(time, query, parameters) {
    logger.warn({ time, query, parameters });
  }
  logSchemaBuild(message) {
    logger.debug({ message });
  }
  logMigration(message) {
    logger.debug({ message });
  }
  log(level, message) {
    if (level === "warn") {
      logger.warn(message);
    } else {
      logger.debug(message);
    }
  }
}
