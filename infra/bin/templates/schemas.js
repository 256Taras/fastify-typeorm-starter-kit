export function generateSchemasFunction({
  SchemaName,
  LowerCaseName,
  TypeBoxAttributes,
  TypeBoxRequireMessage,
  LowerCaseNameSingle,
  isAuthorization,
}) {
  return `
import { Type } from "@sinclair/typebox";

import { SWAGGER_TAGS } from "#constants";
import { BadRequestException, ResourceNotFoundException } from "#errors";
import {
  convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection as convertHttpErrorCollectionToAjvErrors,
  mixinTagForSchemas,
} from "#utils/schemas/index.js";
import { defaultHttpErrorCollection } from "#common/errors/default-http-error-collection.js";
import { COMMON_SCHEMAS_V1 } from "#v1";
import { pick } from "#utils/objects/index.js";

/** Common schemas start */

const ${SchemaName}_ENTITY_SCHEMA = Type.Object({
  id: Type.String({ format: "uuid" }),
  ${TypeBoxAttributes}
  updatedAt: Type.String({ format: "date-time" }),
  createdAt: Type.String({ format: "date-time" }),
}, {
additionalProperties: false,
${TypeBoxRequireMessage ? `errorMessage: ${TypeBoxRequireMessage},` : ""}
});

const ${SchemaName}_OUTPUT_SCHEMA = ${SchemaName}_ENTITY_SCHEMA;
const ${SchemaName}_INPUT_SCHEMA = Type.Omit(${SchemaName}_ENTITY_SCHEMA, ["id", "createdAt", "updatedAt"])

/** Common schemas end */

const ${LowerCaseName}Schemas = {
  getOne: {
    ${isAuthorization ? "security: [{ bearerTokenAuth: [] }]," : ""}
    params: COMMON_SCHEMAS_V1.id,
    response: {
      200: ${SchemaName}_OUTPUT_SCHEMA,
       ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [BadRequestException.name])),
    },
  },
  get: {
    ${isAuthorization ? "security: [{ bearerTokenAuth: [] }]," : ""}
    querystring: COMMON_SCHEMAS_V1.paginationQuery,
    response: {
      200: COMMON_SCHEMAS_V1.pagination(${SchemaName}_OUTPUT_SCHEMA),
      ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [BadRequestException.name])),
    },
  },
  create: {
    ${isAuthorization ? "security: [{ bearerTokenAuth: [] }]," : ""}
    body: ${SchemaName}_INPUT_SCHEMA,
    response: {
      200: ${SchemaName}_OUTPUT_SCHEMA,
         ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [BadRequestException.name])),
    },
  },
  update: {
    ${isAuthorization ? "security: [{ bearerTokenAuth: [] }]," : ""}
    params: COMMON_SCHEMAS_V1.id,
    body: ${SchemaName}_INPUT_SCHEMA,
    response: {
      200: ${SchemaName}_OUTPUT_SCHEMA,
      ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [BadRequestException.name, ResourceNotFoundException.name])),
    },
  },
  delete: {
    ${isAuthorization ? "security: [{ bearerTokenAuth: [] }]," : ""}
    params: COMMON_SCHEMAS_V1.id,
    response: {
      200: COMMON_SCHEMAS_V1.status,
       ...convertHttpErrorCollectionToAjvErrors(pick(defaultHttpErrorCollection, [BadRequestException.name, ResourceNotFoundException.name])),
    },
  },
};

//TODO add tags
export default mixinTagForSchemas(${LowerCaseName}Schemas, SWAGGER_TAGS.${LowerCaseNameSingle});
`;
}
