import { FastifyRequest } from "fastify";

export function validateSchema(
  req: FastifyRequest,
  data: Record<string, any>,
  schema: Record<string, any>,
  context: string,
): boolean;
