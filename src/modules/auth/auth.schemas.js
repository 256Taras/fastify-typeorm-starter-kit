import { Type } from "@sinclair/typebox";

import { SWAGGER_TAGS } from "#constants";
import { COMMON_SCHEMAS_V1 } from "#v1";
import {
  convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection as convertHttpErrorCollectionToAjvErrors,
  mixinTagForSchemas,
} from "#common/utils/schemas/index.js";
import { USER_OUTPUT_SCHEMA } from "#modules/users/users.schemas.js";
import { defaultHttpErrorCollection } from "#src/common/utils/http/default-http-error-collection.js";

// common schemas start

const ACCESS_TOKEN_SCHEMA = Type.Object(
  {
    accessToken: Type.String(),
  },
  { additionalProperties: false },
);

const SIGN_IN_UP_OUTPUT_SCHEMA = Type.Intersect([
  ACCESS_TOKEN_SCHEMA,
  Type.Object({
    user: USER_OUTPUT_SCHEMA,
  }),
]);

const SIGN_UP_INPUT_SCHEMA = Type.Object(
  {
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8, maxLength: 30 }),
    firstName: Type.String({ minLength: 2, maxLength: 20 }),
    lastName: Type.String({ minLength: 2, maxLength: 20 }),
  },
  { additionalProperties: false },
);

// common schemas end

const authSchemas = {
  signUp: {
    description: "Given a valid email and a password, it creates an account for an anonymous user.",
    summary: "Sign up a user by creating an account.",
    body: SIGN_UP_INPUT_SCHEMA,
    response: {
      201: SIGN_IN_UP_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(defaultHttpErrorCollection),
    },
  },
  signIn: {
    summary: "Sign in a user by validating its credentials and return him a JWT.",
    description: `Given a valid email and a password of an existing user, it returns a JWT.`,
    body: Type.Pick(SIGN_UP_INPUT_SCHEMA, ["email", "password"]),
    response: {
      201: SIGN_IN_UP_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(defaultHttpErrorCollection),
    },
  },
  logOut: {
    summary: "Log out authentication user",
    description: `Given a valid refresh token, and delete from cookie.`,
    response: {
      201: COMMON_SCHEMAS_V1.status,
      ...convertHttpErrorCollectionToAjvErrors(defaultHttpErrorCollection),
    },
  },
  refreshTokens: {
    summary: "Refresh authentication tokens.",
    description: `Given a valid refresh token, it returns a access token and set cookie new refresh token.`,
    response: {
      200: SIGN_IN_UP_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(defaultHttpErrorCollection),
    },
  },
};

export default mixinTagForSchemas(authSchemas, SWAGGER_TAGS.auth);
