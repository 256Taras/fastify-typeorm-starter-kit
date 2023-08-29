import RestApi from "#common/infra/api/http-server/server.js";
import { APP_CONFIG, SERVER_CONFIG } from "#src/configs/index.js";
import { logger } from "#common/infra/services/logger/logger.service.js";

import AppDataSource from "../infra/database/typeorm.config.js";

class Application {
  #EXIT_SUCCESS = 0;
  #EXIT_FAILURE = 1;

  // stop all infrastructure: servers, db connections, storage connections (if exists), etc
  async #stopInfrastructure() {
    await RestApi.stop();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  async #gracefulShutdown() {
    logger.info(`[${APP_CONFIG.applicationName}]: Stopping application on port ${SERVER_CONFIG.port}...`);

    const forceShutdown = setTimeout(() => {
      logger.info(`[${APP_CONFIG.applicationName}]: Application on port ${SERVER_CONFIG.port} stopped forcefully`);
      // eslint-disable-next-line no-process-exit
      process.exit(this.#EXIT_FAILURE);
    }, SERVER_CONFIG.shutdownTimeout);

    await this.#stopInfrastructure();

    logger.info(`[${APP_CONFIG.applicationName}]: Application successfully stopped`);
    clearTimeout(forceShutdown);
    // eslint-disable-next-line no-process-exit
    process.exit(this.#EXIT_SUCCESS);
  }

  #initStopHandlers() {
    const handleSignal = async (signal) => {
      logger.info(`[${APP_CONFIG.applicationName}]: ${signal} signal received`);
      await this.#gracefulShutdown();
    };

    // Subscribe to system signals
    ["SIGTERM", "SIGINT", "SIGHUP"].forEach((signal) => {
      process.on(signal, () => handleSignal(signal));
    });

    process.on("unhandledRejection", (reason, promise) => {
      // eslint-disable-next-line no-console
      console.log("Unhandled Rejection at:", promise, "reason:", reason);
      logger.fatal({
        type: "unhandledRejection",
        error: reason,
      });
    });

    process.on("uncaughtException", (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      logger.fatal({
        type: "uncaughtException",
        error: error.stack,
      });
    });
  }

  async #initInfrastructure() {
    logger.info(`[${APP_CONFIG.applicationName}]: Initializing infrastructure...`);
    try {
      await AppDataSource.initialize();
    } catch (error) {
      logger.error(error);
    }
    logger.info(`[${APP_CONFIG.applicationName}]: Infrastructure initialized`);

    if (APP_CONFIG.env === "development") {
      logger.info(`[${APP_CONFIG.applicationName}]: See the documentation on ${APP_CONFIG.applicationUrl}/docs`);
      logger.info(`[${APP_CONFIG.applicationName}]: You can check your database here: ${APP_CONFIG.adminerUrl}`);
    }
  }

  async #start() {
    try {
      this.#initStopHandlers();
      await this.#initInfrastructure();
      // Run servers (all kind of transports: Rest API, WS, etc.)
      await RestApi.start({ ip: SERVER_CONFIG.ip, port: SERVER_CONFIG.port });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      // eslint-disable-next-line no-process-exit
      process.exit(this.#EXIT_FAILURE);
    }
  }

  constructor() {
    // @ts-ignore
    return this.#start();
  }
}

await new Application();

process.on("exit", (code) =>
  // eslint-disable-next-line no-console
  console.info(`\x1b[38;5;43m[${APP_CONFIG.applicationName}] Exit with code: ${code}.\x1b[0m`),
);
