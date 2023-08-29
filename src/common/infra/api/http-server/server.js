//@ts-nocheck
import path from "node:path";

// Import necessary Fastify core and plugins.
import Fastify from "fastify";
import fastifyRequestContextPlugin from "@fastify/request-context";
import fastifySwaggerPlugin from "@fastify/swagger";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormBody from "@fastify/formbody";
import fastifyAutoLoad from "@fastify/autoload";
import fastifyAuth from "@fastify/auth";

// Import custom modules and configurations.
import defaultLogger, { logger } from "#common/infra/services/logger/logger.service.js";
import { getDirName } from "#common/utils/common/index.js";
import {
  globalHttpFastify404ErrorHandler,
  globalHttpFastifyErrorHandler,
} from "#common/errors/fastify-error-handler.js";
import sharedHealthCheckRouter from "#modules/health-check/router.js";
import * as configs from "#src/configs/index.js";

import appV1Plugin from "./v1/http.plugin.js";

export class RestApiServer {
  /** @type {import('fastify/types/instance').FastifyInstance} */
  #fastify;

  /** @type {import('fastify').FastifyPluginOptions} */
  #configs;

  /** @type {import('#src/configs/index.js')} */
  #options;

  constructor(options = {}) {
    this.#configs = options.configs;
    this.#options = options;
  }

  buildServerApp() {
    const fastifyApp = Fastify(this.#configs.FASTIFY_CONFIG);

    // Error handlers to handle 404 and other HTTP errors.
    fastifyApp.setErrorHandler(globalHttpFastifyErrorHandler);
    fastifyApp.setNotFoundHandler(globalHttpFastify404ErrorHandler);

    // Authentication plugin. Provides support for various authentication methods.
    fastifyApp.register(fastifyAuth);

    // Swagger plugin for API documentation.
    fastifyApp.register(fastifySwaggerPlugin, this.#configs.OPENAPI_CONFIG);

    // RequestContext plugin provides context storage across async operations during request/response lifecycle.
    fastifyApp.register(fastifyRequestContextPlugin, {
      defaultStoreValues: {
        logger: defaultLogger,
      },
    });

    // Autoload plugin to load custom plugins from a directory.
    fastifyApp.register(fastifyAutoLoad, {
      dir: path.join(getDirName(import.meta.url), "./../../", "plugins"),
      maxDepth: 1,
      matchFilter: (p) => p.endsWith(".plugin.js"),
      options: this.#options,
    });

    // RateLimit plugin for limiting request rates.
    fastifyApp.register(fastifyRateLimit, this.#configs.FASTIFY_RATE_LIMIT_CONFIG);

    // Helmet plugin for securing the app with important HTTP headers.
    fastifyApp.register(fastifyHelmet, this.#configs.FASTIFY_HELMET_CONFIG);

    // Static plugin for serving static files.
    fastifyApp.register(fastifyStatic, this.#configs.FASTIFY_STATIC_CONFIG);

    // Multipart plugin for handling multipart form data (e.g., file uploads).
    fastifyApp.register(fastifyMultipart, this.#configs.FASTIFY_MULTIPART_CONFIG);

    // FormBody plugin for parsing form bodies into JS objects.
    fastifyApp.register(fastifyFormBody);

    // Registering routers.
    fastifyApp.register(sharedHealthCheckRouter, { prefix: "/api/health-check" });
    fastifyApp.register(appV1Plugin, { prefix: "/v1/", ...this.#options });

    return fastifyApp;
  }

  async stop() {
    // Gracefully stop the Fastify server.
    try {
      await this.#fastify.close();
    } catch (err) {
      logger.error("Server failed to close with error: ", err);
    }
  }

  /**
   *
   * @param {object} param
   * @param {string} param.ip
   * @param {number} param.port
   */
  async start({ ip, port }) {
    const fastifyServer = await this.buildServerApp();

    await fastifyServer.listen({ port, host: ip });

    // Upon server readiness, print the route table and/or plugin tree for debugging purposes.
    fastifyServer.ready(() => {
      if (this.#configs.APP_CONFIG.isDebug) {
        logger.debug(fastifyServer.printRoutes({ commonPrefix: true }));
        // Optional: Print the plugin tree.
        // logger.debug(fastifyServer.printPlugins());
      }
    });

    if (!this.#fastify) this.#fastify = fastifyServer;
  }
}

export default new RestApiServer({ configs });
