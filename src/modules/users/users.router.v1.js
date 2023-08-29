import { ForbiddenException } from "#src/common/errors/common.errors.js";
import { logger } from "#common/infra/services/logger/logger.service.js";
import { omit } from "#common/utils/objects/index.js";

import usersSchemas from "./users.schemas.js";

/** @type {import('@fastify/type-provider-typebox').FastifyPluginAsyncTypebox } */
export default async function usersRouterV1(app) {
  const { userContext, usersRepository } = app.diContainer.cradle;

  app.get("/profile", {
    schema: usersSchemas.getProfile,
    preHandler: app.auth([app.verifyJwt]),
    async handler() {
      logger.debug(`Get an authorized user`);

      const { id } = userContext.get();

      const user = await usersRepository.findOneBy({ id });

      if (!user) return ForbiddenException.of("Access denadied");

      return omit(user, ["password"]);
    },
  });
}
