import { Type } from "@sinclair/typebox";

import { Enum } from "#src/common/utils/schemas/enum.js";
import { ROLES_NAMES, SWAGGER_TAGS } from "#constants";
import {
  convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection as convertHttpErrorCollectionToAjvErrors,
  mixinTagForSchemas,
} from "#utils/schemas/index.js";
import { defaultHttpErrorCollection } from "#common/errors/default-http-error-collection.js";
// common schemas start

export const USER_ENTITY_SCHEMA = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    email: Type.String({ format: "email" }),
    firstName: Type.String({ minLength: 2, maxLength: 25 }),
    lastName: Type.String({ minLength: 2, maxLength: 25 }),
    roles: Type.Array(Enum(ROLES_NAMES)),
    password: Type.String({ minLength: 6, maxLength: 100 }),
    updatedAt: Type.String({ format: "date-time" }),
    createdAt: Type.String({ format: "date-time" }),
    deletedAt: Type.Optional(Type.String({ format: "date-time" })),
  },
  { additionalProperties: false },
);

export const USER_OUTPUT_SCHEMA = Type.Omit(USER_ENTITY_SCHEMA, ["deletedAt", "password"]);

// common schemas end

const usersSchemas = {
  getProfile: {
    description: "Get all information of an authorized user.",
    summary: "Get User info.",
    response: {
      200: USER_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(defaultHttpErrorCollection),
    },
  },
};

export default mixinTagForSchemas(usersSchemas, SWAGGER_TAGS.auth);
