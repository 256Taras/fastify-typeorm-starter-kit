import { Type } from "@sinclair/typebox";
import { envSchema } from "env-schema";

const TypeEnable = Type.Integer({
  maximum: 1,
  minimum: 0,
});

export const CONFIG_SCHEMA = Type.Object(
  {
    APPLICATION_NAME: Type.String(),
    APPLICATION_URL: Type.String(),
    ENV_NAME: Type.String(), // add enum
    NODE_ENV: Type.String(), // add enum
    APPLICATION_DOMAIN: Type.String(),
    REQUEST_TIMEOUT: Type.Integer(),
    LOG_LEVEL: Type.Union(["trace", "debug", "info", "warn", "error", "fatal"].map((i) => Type.Literal(i))),
    ENABLE_PRETTY_LOG: TypeEnable,
    ENABLE_COLORIZED_LOG: TypeEnable,
    ENABLE_DB_LOGGING: TypeEnable,
    ENABLE_SEEDS: TypeEnable,
    ENABLE_REQUEST_LOGGING: TypeEnable,
    ENABLE_DEBUG: TypeEnable,
    ENABLE_RESPONSE_LOGGING_BODY: TypeEnable,
    ENABLE_DEVELOPER_MESSAGE: TypeEnable,
    ENABLE_PERSISTENCE_FORCE_LOGGING: TypeEnable,
    HTTP_PORT: Type.Integer(),
    VERSION: Type.String(),
    SHUTDOWN_TIMEOUT: Type.Integer(),
    IP: Type.String(),
    RATE_LIMIT_MAX: Type.Integer(),
    RATE_LIMIT_TIME_WINDOW: Type.Integer(),
    COMPOSE_PROJECT_NAME: Type.String(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Type.String(),
    JWT_REFRESH_TOKEN_SECRET: Type.String(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Type.String(),
    JWT_ACCESS_TOKEN_SECRET: Type.String(),
    TYPEORM_NAME: Type.String(),
    TYPEORM_TYPE: Type.Literal("postgres"),
    TYPEORM_HOST: Type.String(),
    TYPEORM_PORT: Type.Number(),
    TYPEORM_DATABASE: Type.String(),
    TYPEORM_USERNAME: Type.String(),
    TYPEORM_PASSWORD: Type.String(),
    TYPEORM_SSL: Type.Boolean(),
    TYPEORM_CACHE: Type.Boolean(),
    TYPEORM_LOGGING: Type.Optional(
      Type.Union([
        Type.Literal("all"),
        Type.Literal("error"),
        Type.Literal("warn"),
        Type.Literal("info"),
        Type.Literal("query"),
        Type.Literal("schema"),
        Type.Literal("migration"),
      ]),
    ),
    TYPEORM_DROP_SCHEMA: Type.Boolean(),
    TYPEORM_SYNCHRONIZE: Type.Boolean(),
    TYPEORM_MIGRATIONS_RUN: Type.Boolean(),
  },
  { additionalProperties: false },
);

/**
 *
 * @type {import('./types.js').Env}
 */
export const env = envSchema({
  schema: CONFIG_SCHEMA,
  dotenv: {
    path: "configs/.env",
  },
});
