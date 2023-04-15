/**
 * API layer errors/exceptions
 * Implement Fastify HTTP errors mapping
 */
import { FastifyReply, FastifyRequest } from "fastify";

import { IHttpErrorResponse } from "#common/errors/types/http-error-response.interface";

export declare const globalHttpFastify404ErrorHandler: (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;
export declare const globalHttpFastifyErrorHandler: (
  fastifyError: any,
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;
export declare const globalWebSocketFastifyErrorHandler: (fastifyError: any) => Promise<any>;
export declare const HttpErrorHandlerFactory: (
  errorCollectionOverride: Array<IHttpErrorResponse>,
) => (fastifyError: any, request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const WebSocketErrorHandlerFactory: (
  errorCollectionOverride: Array<IHttpErrorResponse>,
) => (fastifyError: any) => Promise<Array<object>>;
