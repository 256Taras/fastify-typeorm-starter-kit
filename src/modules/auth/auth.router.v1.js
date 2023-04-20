import { authConfig } from "#configs";
import { BadRequestException, ResourceAlreadyExistException, ResourceNotFoundException } from "#errors";
import { ROLES_NAMES, STATUS_SUCCESS } from "#constants";

import authSchemas from "#modules/auth/auth.schemas.js";
import User from "#modules/users/user.entity.js";

/**
 * The `authRouterV1` Fastify plugin.
 *
 * @param app The Fastify instance.
 * @returns A promise of void.
 * @type {import('@fastify/type-provider-typebox').FastifyPluginAsyncTypebox }
 */
export default async function authRouterV1(app) {
  const {
    encrypterService,
    tokenService,
    logger,
    userRefreshTokenContext,
    usersRepository,
    authTokensRepository,
  } = app.diContainer.cradle;
  app.post("/sing-up", {
    schema: authSchemas.signUp,

    async handler(req, rep) {
      const { firstName, lastName, password } = req.body;

      const email = req.body.email.toLocaleLowerCase();

      logger.debug(`Try sign up user with email: ${email}`);

      const maybeUser = await usersRepository.findOneBy({ email });

      if (maybeUser) return ResourceAlreadyExistException.of(`User with email: ${email} already register`);

      const hashedPassword = await encrypterService.getHash(password);

      const newUser = new User({
        id: encrypterService.uuid(),
        email,
        firstName,
        lastName,
        password: hashedPassword,
        roles: [ROLES_NAMES.user],
      });

      const user = await usersRepository.save(newUser);

      const { refreshToken, ...payload } = await tokenService.getTokens(user);

      rep.setCookie(authConfig.cookieKeys.refreshToken, refreshToken, authConfig.refreshTokenCookiesOption);

      rep.code(201);

      return payload;
    },
  });

  app.post("/sing-in", {
    schema: authSchemas.signIn,

    async handler(req, rep) {
      const { email, password } = req.body;

      const user = await usersRepository.findOneBy({ email });

      if (!user) return ResourceNotFoundException.of(`User with email: ${email} not register`);

      const isPasswordValid = await encrypterService.compareHash(password, user.password);

      if (!isPasswordValid) throw new BadRequestException("Incorrect credentials");

      // @ts-ignore
      const { refreshToken, ...payload } = await tokenService.getTokens(user);

      rep.setCookie(authConfig.cookieKeys.refreshToken, refreshToken, authConfig.refreshTokenCookiesOption);

      rep.code(201);

      return payload;
    },
  });

  app.post("/log-out", {
    schema: authSchemas.logOut,
    //  onRequest: app.csrfProtection,
    preValidation: [app.auth([app.verifyJwtRefreshToken])],

    async handler(_, reply) {
      const { id: userId, ppid } = userRefreshTokenContext.get();

      const authToken = await authTokensRepository.delete({ ppid, userId });

      if (!authToken.affected) throw new BadRequestException(`Access decided`);

      reply.clearCookie(authConfig.cookieKeys.refreshToken);

      reply.code(201);

      return STATUS_SUCCESS;
    },
  });

  app.put("/refresh-tokens", {
    schema: authSchemas.refreshTokens,
    // onRequest: app.csrfProtection,
    preValidation: [app.auth([app.verifyJwtRefreshToken])],

    async handler(_, rep) {
      logger.debug("Refresh Tokens");

      const { id, ppid } = userRefreshTokenContext.get();

      const authToken = await authTokensRepository.delete({ ppid, userId: id });

      if (!authToken.affected) throw new BadRequestException(`Access decided`);

      const user = await usersRepository.findOneBy({ id });

      if (!user) throw new BadRequestException(`Access decided`);

      const { refreshToken, ...payload } = await tokenService.getTokens(user);

      rep.setCookie(authConfig.cookieKeys.refreshToken, refreshToken, authConfig.refreshTokenCookiesOption);

      return payload;
    },
  });
}
