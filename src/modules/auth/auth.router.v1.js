import authSchemas from "#modules/auth/auth.schemas.js";
import {
  BadRequestException,
  ResourceAlreadyExistException,
  ResourceNotFoundException,
} from "#common/errors/index.js";
import { ROLES_NAMES, STATUS_SUCCESS } from "#common/constants.js";

/** @type {import("@fastify/type-provider-typebox").FastifyPluginAsyncTypebox } */
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

    async handler({ body: { firstName, lastName, email, password } }) {
      logger.debug(`Try sign up user with email: ${email}`);

      const maybeUser = await usersRepository.findOneBy({ email });

      if (maybeUser) return ResourceAlreadyExistException.of(`User with email: ${email} already register`);

      const hashedPassword = await encrypterService.getHash(password);

      const user = usersRepository.create({
        id: encrypterService.uuid(),
        email,
        firstName,
        lastName,
        password: hashedPassword,
        roles: [ROLES_NAMES.user],
      });

      await usersRepository.save(user);

      // @ts-ignore
      delete user.password;

      return tokenService.generateTokens(user);
    },
  });

  app.post("/sing-in", {
    schema: authSchemas.signIn,

    async handler({ body: { email, password } }) {
      const user = await usersRepository.findOneBy({ email });

      if (!user) return ResourceNotFoundException.of(`User with email: ${email} not register`);

      const isPasswordValid = await encrypterService.compareHash(password, user.password);

      if (!isPasswordValid) throw new BadRequestException("Incorrect credentials");

      return tokenService.generateTokens(user);
    },
  });

  app.post("/log-out", {
    schema: authSchemas.logOut,
    preValidation: [app.auth([app.verifyJwtRefreshToken])],

    async handler() {
      const { id: userId, ppid } = userRefreshTokenContext.get();

      const authToken = await authTokensRepository.delete({ ppid, userId });

      if (!authToken.affected) throw new BadRequestException(`Access decided`);

      return STATUS_SUCCESS;
    },
  });

  app.put("/refresh-tokens", {
    schema: authSchemas.refreshTokens,
    preValidation: [app.auth([app.verifyJwtRefreshToken])],

    async handler() {
      logger.debug("Refresh Tokens");

      const { id, ppid } = userRefreshTokenContext.get();

      const authToken = await authTokensRepository
        .createQueryBuilder()
        .delete()
        .where("ppid = :ppid", { ppid })
        .andWhere("userId = :userId", { userId: id })
        .execute();

      if (!authToken.affected) throw new ResourceNotFoundException(`Token expire or not found`);

      const user = await usersRepository.findOneBy({ id });

      if (!user) throw new ResourceNotFoundException(`User not found`);

      // @ts-ignore
      delete user.password;

      return tokenService.generateTokens(user);
    },
  });
}
