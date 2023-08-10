import { Type } from "@sinclair/typebox";

import { SWAGGER_TAGS } from "#constants";
import { COMMON_SCHEMAS_V1 } from "#v1";
import {
  convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection as convertHttpErrorCollectionToAjvErrors,
  mixinTagForSchemas,
} from "#common/utils/schemas/index.js";
import { USER_ENTITY_SCHEMA, USER_OUTPUT_SCHEMA } from "#modules/users/users.schemas.js";
import { defaultHttpErrorCollection } from "#common/errors/default-http-error-collection.js";
import { BadRequestException, ConflictException, ResourceNotFoundException, UnauthorizedException } from "#errors";
import { pick } from "#utils/objects/index.js";

const ACCESS_TOKEN_SCHEMA = Type.Object(
  {
    accessToken: Type.String(),
    refreshToken: Type.String(),
  },
  { additionalProperties: false },
);

const SIGN_IN_UP_OUTPUT_SCHEMA = Type.Intersect([
  ACCESS_TOKEN_SCHEMA,
  Type.Object(
    {
      user: USER_OUTPUT_SCHEMA,
    },
    { additionalProperties: false },
  ),
]);

const SIGN_UP_INPUT_SCHEMA = Type.Pick(USER_ENTITY_SCHEMA, ["email", "password", "firstName", "lastName"]);

const authSchemas = {
  signUp: {
    summary: "Create new user and return him a JWT.",
    body: SIGN_UP_INPUT_SCHEMA,
    response: {
      201: SIGN_IN_UP_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(
        pick(defaultHttpErrorCollection, [BadRequestException.name, ConflictException.name]),
      ),
    },
  },
  signIn: {
    summary: "Sign in a user by validating its credentials and return him a JWT.",
    body: Type.Pick(SIGN_UP_INPUT_SCHEMA, ["email", "password"]),
    response: {
      200: SIGN_IN_UP_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(
        pick(defaultHttpErrorCollection, [BadRequestException.name, ResourceNotFoundException.name]),
      ),
    },
  },
  logOut: {
    summary: "Log out authentication user",
    security: [{ bearerAuthRefresh: [] }],
    response: {
      200: COMMON_SCHEMAS_V1.status,
      ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [UnauthorizedException.name])),
    },
  },
  refreshTokens: {
    summary: "Refresh authentication tokens.",
    security: [{ bearerAuthRefresh: [] }],
    response: {
      200: SIGN_IN_UP_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [ResourceNotFoundException.name])),
    },
  },
};

export default mixinTagForSchemas(authSchemas, SWAGGER_TAGS.auth);
