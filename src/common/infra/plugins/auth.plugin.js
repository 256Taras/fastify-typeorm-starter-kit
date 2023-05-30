import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";

import { authConfig, fastifyJwtConfig as jwtConfig } from "#configs";
import { UnauthorizedException } from "#errors";
import { logger } from "#services/logger/logger.service.js";

/**
 * Plugin to handle JWT authentication and authorization.
 * @type {import('fastify').FastifyPluginAsync} app
 */
async function authPlugin(app, opt) {
  /**
   * Middleware to verify JWT access tokens.
   * @param {import('fastify').FastifyRequest} req - The Fastify request
   * @throws {UnauthorizedException} If the access token is invalid or expired
   */
  const verifyJwt = async ({ headers }) => {
    try {
      const accessToken = headers.authorization;
      // @ts-ignore
      const user = app.jwt.accessToken.verify(accessToken.split(" ")[1]);
      app.diContainer.cradle.userContext.set(user);
    } catch (e) {
      logger.debug(e);
      throw new UnauthorizedException("Access denied");
    }
  };

  /**
   * Middleware to verify JWT refresh tokens.
   * @param {import('fastify').FastifyRequest} req - The Fastify request
   * @throws {UnauthorizedException} If the refresh token is invalid or expired
   */
  const verifyJwtRefreshToken = async (req) => {
    try {
      // @ts-ignore
      const refreshToken = req.headers[authConfig.refreshTokenKey];

      // @ts-ignore
      const data = app.jwt.refreshToken.verify(refreshToken);
      app.diContainer.cradle.userRefreshTokenContext.set(data);
    } catch (e) {
      logger.debug(e, "verifyJwtRefreshToken error");
      throw new UnauthorizedException("Access denied");
    }
  };

  // Register the fastify-jwt plugin for access tokens.
  app.register(fastifyJwt, {
    secret: jwtConfig.accessTokenSecret,
    namespace: "accessToken",
  });

  // Register the fastify-jwt plugin for refresh tokens.
  app.register(fastifyJwt, {
    secret: jwtConfig.refreshTokenSecret,
    namespace: "refreshToken",
  });

  // Decorate the app instance with the verifyJwt and verifyJwtRefreshToken functions.
  // @ts-ignore
  app.decorate("verifyJwt", opt?.infra?.authService.verifyJwt || verifyJwt);
  // @ts-ignore
  app.decorate("verifyJwtRefreshToken", opt?.infra?.authService.verifyJwtRefreshToken || verifyJwtRefreshToken);
}

export default fp(authPlugin);
