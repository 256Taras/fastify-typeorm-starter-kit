/**
 * API layer errors/exceptions
 * Implement Fastify HTTP errors mapping
 */

import { FastifyReply, FastifyRequest } from "fastify";

/**
 * @param {HttpErrorCollection} [errorCollectionOverride]
 */
declare const HttpFastifyErrorHandlerFactory: (
  errorCollectionOverride: any,
) => (fastifyError: any, request: any, reply: any) => Promise<void>;
export declare const globalHttpFastifyErrorHandler: (fastifyError: any, request: any, reply: any) => Promise<void>;

export declare const globalHttpFastify404ErrorHandler: (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;
export default HttpFastifyErrorHandlerFactory;
