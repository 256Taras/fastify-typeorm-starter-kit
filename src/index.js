import { serverConfig, appConfig } from "#configs";
import { logger } from "#services/logger/logger.service.js";
import RestApi from "#common/infra/api/http-server/server.js";

import AppDataSource from "../infra/database/typeorm.config.js";

// Graceful shutdown
const gracefulShutdown = async () => {
  // begin
  logger.info(`[${appConfig.applicationName}] Stopping server on port ${serverConfig.port}`);

  // init handler of force shutdown
  const timeout = setTimeout(() => {
    logger.info(`[${appConfig.applicationName}] Server on port ${serverConfig.port} stop forcefully`);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }, serverConfig.shutdownTimeout);

  // stop all infrastructure: servers, db connections, storage connections (if exists), etc
  await RestApi.stop();
  try {
    await AppDataSource.destroy();
  } catch (e) {
    logger.error(e);
  }

  logger.info(`[${appConfig.applicationName}] Server successfully stopped.`);
  clearTimeout(timeout); // remove force shutdown handler
  // eslint-disable-next-line no-process-exit
  process.exit(0);
};

const initStopHandlers = () => {
  process.on("SIGTERM", async () => {
    logger.info(`[${appConfig.applicationName}] SIGTERM signal received`);
    await gracefulShutdown();
  });

  process.on("SIGINT", async () => {
    logger.info(`[${appConfig.applicationName}] SIGINT signal received`);
    await gracefulShutdown();
  });

  process.on("SIGHUP", async () => {
    logger.info(`[${appConfig.applicationName}] SIGHUP signal received`);
    await gracefulShutdown();
  });

  process.on("unhandledRejection", (reason, promise) => {
    // eslint-disable-next-line no-console
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    // Application specific logging, throwing an error, or other logic here
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
};

const initInfrastructure = async () => {
  logger.info(`Initializing infrastructure...`);
  try {
    await AppDataSource.initialize();
  } catch (error) {
    logger.error(error);
  }

  logger.info(`Initializing infrastructure finished.`);
  logger.info(`See the documentation on ${`${appConfig.applicationUrl}/docs `}`);
  if (appConfig.env === "development") {
    logger.info(`You can check your database here: ${appConfig.adminerUrl}`);
  }
};

const main = async () => {
  // Subscribe to system signals
  initStopHandlers();
  // Init infrastructure
  await initInfrastructure();

  // optionally can load and validate env variables, etc

  // Run servers (all kind of transports: Rest API, WS, etc.)
  await RestApi.start({ ip: serverConfig.ip, port: serverConfig.port });
};

process.on("exit", (code) =>
  // eslint-disable-next-line no-console
  console.info(`\x1b[38;5;43m[${appConfig.applicationName}] Exit with code: ${code}.\x1b[0m`),
);

try {
  await main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);

  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
