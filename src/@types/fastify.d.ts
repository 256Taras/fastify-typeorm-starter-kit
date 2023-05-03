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
    parseMultipartFields: (schemas: FastifySchema) => (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    removeUploadIfExists: (filePath: string) => Promise<void>;
    uploadToStorage: (uploadedFile: Record<string, any>, folder: string) => Promise<string>;
    upload: (uploadedFile: Record<string, any>) => Promise<string>;
    configs: typeof configs;
  }
}

declare module "@fastify/awilix" {
  interface Cradle {
    app: Fastify.FastifyInstance;
    dbConnection: typeof AppDataSource;
  }
}
