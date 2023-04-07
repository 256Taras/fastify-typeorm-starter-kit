import { FastifySchema } from "fastify";

export function mixinTagForSchemas<T extends Record<string, FastifySchema>>(schemas: T, tag: string[]): T;
