import fp from "fastify-plugin";
import { AccessControl } from "accesscontrol";

import { ForbiddenException } from "#errors";

import { permissionsConfig } from "#configs";
import { userContext } from "#common/utils/http/user.context.js";

/**
 * A Fastify plugin for implementing role-based access control.
 * @param {import('fastify').FastifyInstance} app - A Fastify instance.
 * @returns {Promise<void>}
 */
async function accessControlPlugin(app) {
  const accessControl = new AccessControl(permissionsConfig);
  /**

    Decorates a Fastify instance with a "can" method that checks whether the user has the specified permission.
    @param {string} action - The action to be performed (e.g. "read", "write", "delete").
    @param {string} resource - The resource to be accessed (e.g. "user", "post", "comment").
    @returns {Promise<void>}
    @throws {ForbiddenException} if the user is not authenticated or does not have the required permission.
    */
  app.decorate("can", async (action, resource) => {
    const userCtx = userContext.get();

    // @ts-ignore
    const user = await app.diContainer.cradle.usersRepository.findOneBy({ id: userCtx.id });
    // @ts-ignore
    if (!user || user.roles.length === 0) {
      throw new ForbiddenException("Access denied");
    }
    // @ts-ignore
    const permission = accessControl.can(user.roles)[action](resource);

    if (!permission.granted) {
      throw new ForbiddenException("Access denied");
    }
  });
}

export default fp(accessControlPlugin);
