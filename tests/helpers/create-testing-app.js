// we would like to test whole server instead of httpPlugin (server incorporate global error handling, etc)
// but actually it may be better to register everything to httpPlugin, instead of server.

// @ts-ignore
import { RestApiServer } from "#common/infra/api/http-server/server.js";
import { logger } from "#services/logger/logger.service.js";
import * as configs from "#configs";
import DataSource from "../../infra/database/typeorm.config.js";

/**
 * Creates a testing application that allows testing the entire server instead of just the app plugin.
 * @param option - An optional configuration object.
 * @returns An object containing the app instance and a teardown function.
 */
export async function createTestingApp(option = {}) {
  if (!option?.configs) {
    // eslint-disable-next-line no-param-reassign
    option.configs = configs;
  }

  await DataSource.initialize();
  const app = new RestApiServer(option).buildServerApp();

  return {
    app,
    teardown: async () => {
      await app.close();
      await DataSource.destroy();
      logger.debug("Test app successful closed");
    },
  };
}
