import fp from "fastify-plugin";
import { requestContext } from "@fastify/request-context";

import defaultLogger from "#common/infra/services/logger/logger.service.js";
import { APP_CONFIG, LOGGER_CONFIG } from "#src/configs/index.js";

/**
 * @param {import('fastify').FastifyInstance} app
 */
async function requestLoggerPlugin(app) {
  app.addHook("onRequest", setTraceIdFastifyHook);
  app.addHook("onRequest", requestLogger);
  app.addHook("onResponse", responseLogger);

  /**
   * @param {import('fastify').FastifyRequest} request
   * @param {import('fastify').FastifyReply} reply
   * @param {import('fastify').DoneFuncWithErrOrRes} done
   */
  function setTraceIdFastifyHook(request, reply, done) {
    const requestId = request.id;
    const childLogger = defaultLogger.child({ traceId: requestId });
    // @ts-ignore
    requestContext.set("logger", childLogger);
    // @ts-ignore
    requestContext.set("traceId", requestId);
    done();
  }

  /**
   * @param {import('fastify').FastifyRequest} request
   * @param {import('fastify').FastifyReply} reply
   * @param {import('fastify').DoneFuncWithErrOrRes} done
   */
  function requestLogger(request, reply, done) {
    if (LOGGER_CONFIG.enableRequestLogging) {
      defaultLogger.info({
        requestId: request.id,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
          ip: request.ip,
          ips: request.ips,
          hostname: request.hostname,
          protocol: request.protocol,
          authorization: !!request.headers.authorization ?? null,
          contentType: request.headers["content-type"],
          userAgent: request.headers["user-agent"] ?? null,
        },
        msg: "Incoming request",
      });
    }
    done();
  }

  /**
   * @param {import('fastify').FastifyRequest} request
   * @param {import('fastify').FastifyReply} reply
   * @param {import('fastify').DoneFuncWithErrOrRes} done
   */
  function responseLogger(request, reply, done) {
    if (LOGGER_CONFIG.enableRequestLogging) {
      defaultLogger.info({
        requestId: request.id,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
          body: APP_CONFIG.env !== "production" ? request.body : undefined,
          ip: request.ip,
          ips: request.ips,
          hostname: request.hostname,
          protocol: request.protocol,
          statusCode: reply.raw.statusCode,
          responseTime: reply.getResponseTime(),
          contentType: request.headers["content-type"],
          authorization: !!request.headers.authorization ?? null,
          userAgent: request.headers["user-agent"] ?? null,
        },
        msg: "Request completed",
      });
    }
    done();
  }
}

export default fp(requestLoggerPlugin);
