import type { Static } from "@sinclair/typebox";
import { Repository } from "typeorm";

import type User from "#modules/users/user.entity";

import type { USER_ENTITY_SCHEMA } from "./users.schemas.js";

declare module "@fastify/awilix" {
  interface Cradle {
    usersRepository: Repository<User>;
  }
}

export type IUser = Static<typeof USER_ENTITY_SCHEMA>;
