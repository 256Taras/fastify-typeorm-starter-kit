import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import * as awilix from "awilix";
import fp from "fastify-plugin";

import * as nconf from "#configs";
import { userContext, userRefreshTokenContext } from "#utils/common/user.context.js";
import { getDirName } from "#common/utils/common/index.js";
import { logger } from "#services/logger/logger.service.js";

import AppDataSource from "../../../../infra/database/typeorm.config.js";

const basePath = "../../../";

export const toCamelCase = (srt) =>
  srt.toLowerCase().replace(/([_-][a-z])/g, (g) => g.toUpperCase().replace("-", "").replace("_", ""));

/**
 * A Fastify plugin that creates a dependency injection container using Awilix.
 * @type {import('fastify').FastifyPluginAsync} app
 */
async function diContainerPlugin(app, otp) {
  const __dirname = getDirName(import.meta.url);
  /**
   * @common
   */
  diContainer.register({
    // Internal system
    // @ts-ignore
    app: awilix.asFunction(() => otp.app ?? app, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    // @ts-ignore
    configs: awilix.asValue(otp.configs || nconf),
    logger: awilix.asValue(logger),
    userContext: awilix.asValue(userContext),
    userRefreshTokenContext: awilix.asValue(userRefreshTokenContext),
    dbConnection: awilix.asValue(AppDataSource),
  });

  await diContainer.loadModules(
    [`${basePath}modules/**/**.entity.js`, `${basePath}common/infra/models/**.entity.js`],
    {
      cwd: __dirname,
      resolverOptions: {
        lifetime: awilix.Lifetime.SINGLETON,
        register: (entity) => awilix.asValue(AppDataSource.getRepository(entity.name)),
      },
      esModules: true,
      formatName: (name) => {
        const splat = name.split(".");
        const modelName = toCamelCase(splat[0]);
        return `${modelName}sRepository`;
      },
    },
  );

  await diContainer.loadModules(
    [
      `${basePath}common/infra/services/**/**.service.js`,
      `${basePath}modules/**/**.service.js`,
      `${basePath}modules/**/**.repository.js`,
    ],
    {
      cwd: __dirname,
      // @ts-ignore
      lifetime: awilix.Lifetime.SINGLETON,
      resolverOptions: {
        register: awilix.asClass,
        injectionMode: awilix.InjectionMode.PROXY,
      },
      formatName: "camelCase",
      esModules: true,
    },
  );

  await diContainer.loadModules([`${basePath}modules/**/**.use-case.js`], {
    cwd: __dirname,
    resolverOptions: {
      register(useCase, opts) {
        return awilix.asFunction((deps) => (payload) => useCase(deps, payload), opts);
      },
      injectionMode: awilix.InjectionMode.PROXY,
    },
    formatName: "camelCase",
    esModules: true,
  });

  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: false,
  });
}

export default fp(diContainerPlugin, { name: "container" });
