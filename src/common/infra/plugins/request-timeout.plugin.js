import fp from "fastify-plugin";
import { requestContext } from "@fastify/request-context";

import { SERVER_TIMEOUT_408 } from "#errors";

const TIMEOUT_KEY = "TIMEOUT_KEY";
const CONTROLLER_KEY = "CONTROLLER_KEY";
const SIGNAL_KEY = "SIGNAL_KEY";

/**
 * Plugin to handle request timeout.
 * @example Route-Level Usage
 * fastify.get('/some-route', {
 *   config: {
 *     timeout: 2000 // 2 seconds
 *   }
 * }, async (request, reply) => {
 *   // Your handler logic
 * });
 * @type {import('@fastify/type-provider-typebox').FastifyPluginAsyncTypebox} app
 */
async function requestTimeoutPlugin(app, options) {
  function setupRequestTimeout(req, reply, done) {
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const timeoutId = setTimeout(() => {
        controller.abort();
        done(new SERVER_TIMEOUT_408());
      }, reply.context.config.timeout ?? options.configs.serverConfig.requestTimeout);

      requestContext.set(TIMEOUT_KEY, timeoutId);
      requestContext.set(CONTROLLER_KEY, controller);
      requestContext.set(SIGNAL_KEY, signal);

      done();
    } catch (error) {
      done(error);
    }
  }

  function cleanupResources() {
    const timeoutId = requestContext.get(TIMEOUT_KEY);
    if (timeoutId) {
      clearTimeout(timeoutId);
      requestContext.set(TIMEOUT_KEY, null);
      requestContext.set(CONTROLLER_KEY, null);
      requestContext.set(SIGNAL_KEY, null);
    }
  }

  app.addHook("onRequest", setupRequestTimeout);

  app.addHook("onSend", (req, reply, payload, done) => {
    try {
      cleanupResources();
      done(null, payload);
    } catch (error) {
      done(error);
    }
  });

  app.addHook("onError", (req, reply, error, done) => {
    cleanupResources();
    done(error);
  });
}

export default fp(requestTimeoutPlugin);
