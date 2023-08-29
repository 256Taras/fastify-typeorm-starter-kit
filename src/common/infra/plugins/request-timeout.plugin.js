import fp from "fastify-plugin";
import { requestContext } from "@fastify/request-context";

import { SERVER_TIMEOUT_408 } from "#common/errors/index.js";
import { SERVER_CONFIG } from "#src/configs/index.js";

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
  app.addHook("onRequest", setupRequestTimeout);
  app.addHook("onSend", (req, reply, payload, done) => {
    try {
      cleanupResources();
      done(null, payload);
    } catch (error) {
      // @ts-ignore
      done(error);
    }
  });
  app.addHook("onError", (req, reply, error, done) => {
    cleanupResources();
    // @ts-ignore
    done(error);
  });

  function setupRequestTimeout(_, reply, done) {
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const timeoutId = setTimeout(() => {
        controller.abort();
        done(new SERVER_TIMEOUT_408());
        // @ts-ignore
      }, reply.context.config.timeout ?? options.configs.SERVER_CONFIG.requestTimeout);

      // @ts-ignore
      requestContext.set(TIMEOUT_KEY, timeoutId);
      // @ts-ignore
      requestContext.set(CONTROLLER_KEY, controller);
      // @ts-ignore
      requestContext.set(SIGNAL_KEY, signal);

      done();
    } catch (error) {
      done(error);
    }
  }

  function cleanupResources() {
    // @ts-ignore
    const timeoutId = requestContext.get(TIMEOUT_KEY);
    if (timeoutId) {
      clearTimeout(timeoutId);
      // @ts-ignore
      requestContext.set(TIMEOUT_KEY, null);
      // @ts-ignore
      requestContext.set(CONTROLLER_KEY, null);
      // @ts-ignore
      requestContext.set(SIGNAL_KEY, null);
    }
  }
}
export default fp(requestTimeoutPlugin);
