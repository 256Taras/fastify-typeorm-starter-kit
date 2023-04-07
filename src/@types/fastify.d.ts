import { FastifyAuthFunction } from "@fastify/auth";
import * as Fastify from "fastify";
import * as configs from "../configs/index.js";
import type AppDataSource from "../../infra/database/typeorm.config.js";

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    verifyJwt: FastifyAuthFunction;
    verifyJwtRefreshToken: FastifyAuthFunction;
    verifyApiKey: FastifyAuthFunction;

    configs: typeof configs;
  }
}

declare module "@fastify/awilix" {
  interface Cradle {
    app: Fastify.FastifyInstance;
    dbConnection: typeof AppDataSource;
  }
}
