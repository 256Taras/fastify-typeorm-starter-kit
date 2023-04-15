import { Type } from "@sinclair/typebox";
import { ROLES_NAMES, LIMIT, OFFSET } from "#constants";

const createdAt = Type.Object({ createdAt: Type.String({ format: "date-time" }) });
const updatedAt = Type.Object({ updatedAt: Type.String({ format: "date-time" }) });

export const COMMON_SCHEMAS_V1 = {
  headers: {
    authorization: Type.Object({
      Authorization: Type.String(),
    }),
    authorizationApiKey: Type.Object({
      apiKey: Type.String(),
    }),
  },
  status: Type.Object(
    {
      status: Type.Boolean(),
    },
    { additionalProperties: false },
  ),
  createdAt,
  updatedAt,
  timestamp: Type.Intersect([createdAt, updatedAt]),
  offsetLimit: Type.Object({
    offset: Type.Integer({
      description:
        "Number of records to be skipped to retrieve the documents. default is 0, starts from beginning.",
      maximum: 10000,
      minimum: 0,
      default: OFFSET,
    }),
    limit: Type.Integer({
      description: `Batch size, the number of documents to be fetched in a single go. Default is ${LIMIT}.`,
      minimum: 0,
      maximum: 100,
      default: LIMIT,
    }),
  }),
  roles: Type.Array(Type.String({ enum: Object.values(ROLES_NAMES) }), {
    uniqueItems: true,
    minItems: 1,
  }),
  email: Type.Object(
    {
      email: Type.String({ format: "email" }),
    },
    { additionalProperties: false },
  ),
  id: Type.Object(
    {
      id: Type.String({ format: "uuid" }),
    },
    { additionalProperties: false },
  ),
  paginationQuery: Type.Object({
    page: Type.Integer({
      description: "Current page. Default is 1.",
      minimum: 1,
      default: 1,
    }),
    limit: Type.Integer({
      description: `Batch size, the number of documents to be fetched in a single go. Default is ${LIMIT}.`,
      minimum: 1,
      maximum: 100,
      default: LIMIT,
    }),
  }),
  pagination: (data) =>
    Type.Object({
      total: Type.Number(),
      page: Type.Number(),
      data: Type.Array(data),
    }),
};