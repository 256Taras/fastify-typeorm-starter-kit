import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";

import { AUTH_CONFIG, FASTIFY_JWT_CONFIG as jwtConfig } from "#src/configs/index.js";
import { UnauthorizedException } from "#common/errors/index.js";
import { logger } from "#common/infra/services/logger/logger.service.js";

const ACCESS_DENIED_MESSAGE = "Access denied";

/**
 * A Fastify plugin to handle JWT authentication and authorization.
 * @type {import('fastify').FastifyPluginAsync} app
 */
async function authPlugin(app, options) {
  app.register(fastifyJwt, { secret: jwtConfig.accessTokenSecret, namespace: "accessToken" });
  app.register(fastifyJwt, { secret: jwtConfig.refreshTokenSecret, namespace: "refreshToken" });

  // @ts-ignore
  app.decorate("verifyJwt", options?.infra?.authService.verifyJwt ?? defaultVerifyJwt);
  app.decorate(
    "verifyJwtRefreshToken",
    // @ts-ignore
    options?.infra?.authService.verifyJwtRefreshToken ?? defaultVerifyJwtRefreshToken,
  );

  /**
   * Default middleware to verify JWT access tokens.
   * @this {import('fastify').FastifyInstance} request - The Fastify instance
   * @param {import('fastify').FastifyRequest} request - The Fastify request
   */
  async function defaultVerifyJwt(request) {
    const { headers } = request;

    try {
      const accessToken = headers.authorization?.split(" ")[1];
      if (!accessToken) {
        throw new UnauthorizedException(ACCESS_DENIED_MESSAGE);
      }

      // @ts-ignore
      const user = app.jwt.accessToken.verify(accessToken);
      app.diContainer.cradle.userContext.set(user);
    } catch (error) {
      logger.debug(error, "Error during access token verification");
      throw new UnauthorizedException(ACCESS_DENIED_MESSAGE);
    }
  }

  /**
   * Default middleware to verify JWT refresh tokens.
   * @this {import('fastify').FastifyInstance} request - The Fastify instance
   * @param {import('fastify').FastifyRequest} request - The Fastify request
   */
  async function defaultVerifyJwtRefreshToken(request) {
    try {
      const refreshToken = request.headers[AUTH_CONFIG.refreshTokenKey];
      // @ts-ignore
      const data = app.jwt.refreshToken.verify(refreshToken);
      app.diContainer.cradle.userRefreshTokenContext.set(data);
    } catch (error) {
      logger.debug(error, "Error during refresh token verification");
      throw new UnauthorizedException(ACCESS_DENIED_MESSAGE);
    }
  }
}

export default fp(authPlugin);
