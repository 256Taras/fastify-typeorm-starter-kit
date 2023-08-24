import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import * as awilix from "awilix";
import fp from "fastify-plugin";

import * as nconf from "#configs";
import { userContext, userRefreshTokenContext } from "#utils/common/user.context.js";
import { getDirName } from "#common/utils/common/index.js";
import { logger } from "#services/logger/logger.service.js";

import AppDataSource from "../../../../infra/database/typeorm.config.js";

const basePath = "../../../";


/**
 * A Fastify plugin that creates a dependency injection container using Awilix.
 *
 * @param {import('fastify').FastifyInstance} app - The Fastify application instance.
 * @param {object} otp - Additional plugin options.
 * @returns {Promise<void>}
 */
async function diContainerPlugin(app, otp) {
  const __dirname = getDirName(import.meta.url);

  // Common dependency registrations
  diContainer.register({
    app: awilix.asFunction(() => otp.app ?? app, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    // @ts-ignore
    configs: awilix.asValue(otp.configs ?? nconf),
    logger: awilix.asValue(logger),
    userContext: awilix.asValue(userContext),
    userRefreshTokenContext: awilix.asValue(userRefreshTokenContext),
    dbConnection: awilix.asValue(AppDataSource),
  });

  // Load and register entity repositories
  await loadEntityRepositories(__dirname);

  // Load and register services, repositories
  await loadServicesAndRepositories(__dirname);

  // Load and register use-cases
  await loadUseCases(__dirname);

  // Register Awilix plugin with Fastify
  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: false,
  });
}


/**
 * Convert a string to camelCase.
 *
 * @param {string} srt - The input string.
 * @returns {string} - The string in camelCase format.
 */
export const toCamelCase = (srt) =>
  srt.toLowerCase().replace(/([_-][a-z])/g, (g) => g.toUpperCase().replace("-", "").replace("_", ""));


/**
 * Load and register entity repositories into the container.
 *
 * @param {string} __dirname - The directory name.
 * @returns {Promise<import("awilix").AwilixContainer>}
 */
async function loadEntityRepositories(__dirname) {
  return diContainer.loadModules(
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
    }
  );
}

/**
 * Load and register services and repositories into the container.
 *
 * @param {string} __dirname - The directory name.
 * @returns {Promise<import("awilix").AwilixContainer>}
 */
async function loadServicesAndRepositories(__dirname) {
  return diContainer.loadModules(
    [
      `${basePath}common/infra/services/**/**.service.js`,
      `${basePath}modules/**/**.service.js`,
      `${basePath}modules/**/**.repository.js`,
    ],
    {
      cwd: __dirname,
      resolverOptions: {
        lifetime: awilix.Lifetime.SINGLETON,
        register: awilix.asClass,
        injectionMode: awilix.InjectionMode.PROXY,
      },
      formatName: "camelCase",
      esModules: true,
    }
  );
}

/**
 * Load and register use-cases into the container.
 *
 * @param {string} __dirname - The directory name.
 * @returns {Promise<import("awilix").AwilixContainer>}
 */
async function loadUseCases(__dirname) {
  return diContainer.loadModules([`${basePath}modules/**/**.use-case.js`], {
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
}


export default fp(diContainerPlugin, { name: "container" });