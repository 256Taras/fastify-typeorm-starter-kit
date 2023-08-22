import path from "node:path";

import Fastify from "fastify";
import fastifyRequestContextPlugin from "@fastify/request-context";
import fastifySwaggerPlugin from "@fastify/swagger"; // should be added first and registered before any plugin
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormBody from "@fastify/formbody";
import fastifyAutoLoad from "@fastify/autoload";

import defaultLogger, { logger } from "#common/infra/services/logger/logger.service.js";
import { getDirName } from "#common/utils/common/index.js";
import {
  globalHttpFastify404ErrorHandler,
  globalHttpFastifyErrorHandler,
} from "#common/errors/fastify-error-handler.js";
import sharedHealthCheckRouter from "#modules/health-check/router.js";
import * as configs from "#configs";

import appV1Plugin from "./v1/http.plugin.js";

export class RestApiServer {
  /**
   * @type {import('fastify/types/instance').FastifyInstance}
   */
  // @ts-ignore
  #fastify;

  /**
   * @type {import('fastify').FastifyPluginOptions}
   */
  #options;

  constructor(options = {}) {
    this.#options = options;
  }

  buildServerApp() {
    const fastifyApp = Fastify(this.#options.configs.fastifyConfig);
    // @ts-ignore
    fastifyApp.register(fastifySwaggerPlugin, this.#options.configs.openapiConfig);

    fastifyApp.register(fastifyRequestContextPlugin, {
      defaultStoreValues: {
        logger: defaultLogger,
      },
    });

    // Enable custom error response
    // @ts-ignore
    fastifyApp.setErrorHandler(globalHttpFastifyErrorHandler);
    // @ts-ignore

    fastifyApp.setNotFoundHandler(globalHttpFastify404ErrorHandler);

    // Load custom plugins
    fastifyApp.register(fastifyAutoLoad, {
      dir: path.join(getDirName(import.meta.url), "./../../", "plugins"),
      maxDepth: 1,
      matchFilter: (p) => p.endsWith(".plugin.js"),
      options: this.#options,
    });

    // allows to rewrite via preHandler per route
    // @ts-ignore
    fastifyApp.register(fastifyRateLimit, this.#options.configs.fastifyRateLimitConfig);
    // `fastify-helmet` helps you secure your application
    // with important security headers. It's not a silver bullet™,
    // but security is an orchestration of multiple tools that work
    // together to reduce the attack surface of your application.
    fastifyApp.register(fastifyHelmet, this.#options.configs.fastifyHelmetConfig);
    fastifyApp.register(fastifyStatic, this.#options.configs.fastifyStaticConfig);
    fastifyApp.register(fastifyMultipart, this.#options.configs.fastifyMultipartConfig);
    fastifyApp.register(fastifyFormBody);
    // This plugin is especially useful if you expect a high load
    // on your application, it measures the process load and returns
    // a 503 if the process is undergoing too much stress.
    // fastifyApp.register(fastifyUnderPressure, fastifyUnderPressureConfig);

    /**
     * WARNING!!! The router must be Promise because the error issued by fastify is not clear
     */
    fastifyApp.register(sharedHealthCheckRouter, { prefix: "/api/health-check" });
    fastifyApp.register(appV1Plugin, { prefix: "/v1/", ...this.#options });

    return fastifyApp;
  }

  async stop() {
    try {
      await this.#fastify.close();
    } catch (err) {
      logger.error("Server failed to close with error: ", err);
    }
  }

  /**
   *
   * @param {object} param0
   * @param {string} param0.ip
   * @param {number} param0.port
   */
  async start({ ip, port }) {
    const fastifyServer = await this.buildServerApp();

    await fastifyServer.listen({ port, host: ip });
    fastifyServer.ready(() => {
      if (this.#options.configs.appConfig.isDebug) {
        logger.debug(fastifyServer.printRoutes({ commonPrefix: true }));
      }
      // you can check the plugin tree and their loading time
      // logger.debug(fastifyServer.printPlugins());
    });

    // @ts-ignore
    if (!this.#fastify) this.#fastify = fastifyServer;
  }
}

export default new RestApiServer({ configs });
