import fp from "fastify-plugin";
import { requestContext } from "@fastify/request-context";

import defaultLogger from "#common/infra/services/logger/logger.service.js";
import { appConfig, loggerConfig } from "#configs";

class RequestLoggerPlugin {
  static of = (app) => Promise.resolve(new RequestLoggerPlugin(app));

  constructor(app) {
    app.addHook("onRequest", this.#setTraceIdFastifyHook);
    app.addHook("onRequest", this.#requestLogger);
    app.addHook("onResponse", this.#responseLogger);
  }

  /**
   *
   * @param {import('fastify').FastifyRequest} request
   * @param {import('fastify').FastifyReply} reply
   * @param {import('fastify').DoneFuncWithErrOrRes} done
   */
  #setTraceIdFastifyHook = (request, reply, done) => {
    // request.id -- fastify automatically use 'request-id' header as request id
    const requestId = request.id;
    const childLogger = defaultLogger.child({ traceId: requestId });
    requestContext.set("logger", childLogger);
    requestContext.set("traceId", requestId);
    done();
  };

  /**
   *
   * @param {import('fastify').FastifyRequest} request
   * @param {import('fastify').FastifyReply} reply
   * @param {import('fastify').DoneFuncWithErrOrRes} done
   */
  #requestLogger = (request, reply, done) => {
    if (loggerConfig.enableRequestLogging) {
      defaultLogger.info({
        requestId: request.id,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
          // @ts-ignore
          body: appConfig.env !== "production" ? reply.raw?.body : undefined,
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
  };

  /**
   *
   * @param {import('fastify').FastifyRequest} request
   * @param {import('fastify').FastifyReply} reply
   * @param {import('fastify').DoneFuncWithErrOrRes} done
   */
  #responseLogger = (request, reply, done) => {
    if (loggerConfig.enableRequestLogging) {
      defaultLogger.info({
        requestId: request.id,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
          body: appConfig.env !== "production" ? request.body : undefined,
          ip: request.ip,
          ips: request.ips,
          hostname: request.hostname,
          protocol: request.protocol,
          statusCode: reply.raw.statusCode,
          responseTime: reply.getResponseTime(),
          contentType: request.headers["content-type"],
          authorization: !!request.headers.authorization || null,
          userAgent: request.headers["user-agent"] || null,
        },
        msg: "Request completed",
      });
    }
    done();
  };
}

export default fp(RequestLoggerPlugin.of);
