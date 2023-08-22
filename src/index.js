import { serverConfig, appConfig } from "#configs";
import { logger } from "#services/logger/logger.service.js";
import RestApi from "#common/infra/api/http-server/server.js";

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
    logger.info(`[${appConfig.applicationName}]: Stopping application on port ${serverConfig.port}...`);

    const forceShutdown = setTimeout(() => {
      logger.info(`[${appConfig.applicationName}]: Application on port ${serverConfig.port} stopped forcefully`);
      // eslint-disable-next-line no-process-exit
      process.exit(this.#EXIT_FAILURE);
    }, serverConfig.shutdownTimeout);

    await this.#stopInfrastructure();

    logger.info(`[${appConfig.applicationName}]: Application successfully stopped`);
    clearTimeout(forceShutdown);
    // eslint-disable-next-line no-process-exit
    process.exit(this.#EXIT_SUCCESS);
  }

  #initStopHandlers() {
    const handleSignal = async (signal) => {
      logger.info(`[${appConfig.applicationName}]: ${signal} signal received`);
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
    logger.info(`[${appConfig.applicationName}]: Initializing infrastructure...`);
    try {
      await AppDataSource.initialize();
    } catch (error) {
      logger.error(error);
    }
    logger.info(`[${appConfig.applicationName}]: Infrastructure initialized`);

    if (appConfig.env === "development") {
      logger.info(`[${appConfig.applicationName}]: See the documentation on ${appConfig.applicationUrl}/docs`);
      logger.info(`[${appConfig.applicationName}]: You can check your database here: ${appConfig.adminerUrl}`);
    }
  }

  async #start() {
    try {
      this.#initStopHandlers();
      await this.#initInfrastructure();
      // Run servers (all kind of transports: Rest API, WS, etc.)
      await RestApi.start({ ip: serverConfig.ip, port: serverConfig.port });
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
  console.info(`\x1b[38;5;43m[${appConfig.applicationName}] Exit with code: ${code}.\x1b[0m`),
);
