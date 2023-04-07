import { FastifyRequest } from "fastify";

export function pagination(request: FastifyRequest): {
  page: number;
  limit: number;
  offset: number;
};
