import { Type } from "@sinclair/typebox";

import { SWAGGER_TAGS } from "#constants";
import { COMMON_SCHEMAS_V1 } from "#v1";
import {
  convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection as convertHttpErrorCollectionToAjvErrors,
  mixinTagForSchemas,
} from "#common/utils/schemas/index.js";
import { USER_OUTPUT_SCHEMA } from "#modules/users/users.schemas.js";
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

const SIGN_UP_INPUT_SCHEMA = Type.Object(
  {
    email: Type.String({
      format: "email",
      errorMessage: {
        format: "Email must be valid",
      },
    }),
    password: Type.String({
      minLength: 8,
      maxLength: 30,
      errorMessage: {
        minLength: "Password must be at least 8 characters long",
        maxLength: "Password must not exceed 30 characters",
        required: "Password is required",
      },
    }),
    firstName: Type.String({
      minLength: 2,
      maxLength: 20,
      errorMessage: {
        minLength: "First name must be at least 2 characters long",
        maxLength: "First name must not exceed 20 characters",
      },
    }),
    lastName: Type.String({
      minLength: 2,
      maxLength: 20,
      errorMessage: {
        minLength: "Last name must be at least 2 characters long",
        maxLength: "Last name must not exceed 20 characters",
      },
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      required: {
        email: "Email is required",
        password: "Password is required",
        firstName: "First name is required",
        lastName: "Last name is required",
      },
    },
  },
);

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
