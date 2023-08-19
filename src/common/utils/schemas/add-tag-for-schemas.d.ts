import { FastifySchema } from "fastify";

export declare function mixinTagForSchemas<T extends Record<string, FastifySchema>>(schemas: T, tag: string[]): T;
