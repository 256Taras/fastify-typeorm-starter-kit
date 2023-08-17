import { Type } from "@sinclair/typebox";

import { Enum } from "#src/common/utils/schemas/enum.js";
import { ROLES_NAMES } from "#constants";
import {
  convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection as convertHttpErrorCollectionToAjvErrors,
  mixinTagForSchemas,
} from "#utils/schemas/index.js";
import { defaultHttpErrorCollection } from "#common/errors/default-http-error-collection.js";

export const USER_ENTITY_SCHEMA = Type.Object(
  {
    id: Type.String({ format: "uuid" }),
    email: Type.String({
      format: "email",
      errorMessage: {
        format: "Email must be valid",
      },
    }),
    firstName: Type.String({
      minLength: 2,
      maxLength: 25,
      errorMessage: {
        minLength: "First name must be at least 2 characters long",
        maxLength: "First name must not exceed 25 characters",
      },
    }),
    lastName: Type.String({
      minLength: 2,
      maxLength: 25,
      errorMessage: {
        minLength: "Last name must be at least 2 characters long",
        maxLength: "Last name must not exceed 25 characters",
      },
    }),
    roles: Type.Array(
      Enum(ROLES_NAMES, {
        errorMessage: "Invalid role value",
      }),
    ),
    password: Type.String({
      minLength: 6,
      maxLength: 100,
      errorMessage: {
        minLength: "Password must be at least 6 characters long",
        maxLength: "Password must not exceed 100 characters",
      },
    }),
    updatedAt: Type.String({
      format: "date-time",
      errorMessage: {
        format: "Invalid date-time format for updatedAt",
      },
    }),
    createdAt: Type.String({
      format: "date-time",
      errorMessage: {
        format: "Invalid date-time format for createdAt",
      },
    }),
    deletedAt: Type.Optional(
      Type.String({
        format: "date-time",
        errorMessage: {
          format: "Invalid date-time format for deletedAt",
        },
      }),
    ),
  },
  {
    additionalProperties: false,
    errorMessage: {
      required: {
        email: "Email is required",
        password: "Password is required",
        firstName: "First name is required",
        lastName: "Last name is required",
        roles: "Role are required",
        createdAt: "createdAt is required",
      },
    },
  },
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

export default mixinTagForSchemas(usersSchemas, ["users"]);
