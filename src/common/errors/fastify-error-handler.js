/**
 * API layer errors/exceptions
 * Implement Fastify HTTP errors mapping
 */

/**
 * @typedef {import('#types/index.js').HttpErrorCollection} HttpErrorCollection
 */
import { appConfig } from "#configs";

import { logger } from "#services/logger/logger.service.js";

import {
  EndpointNotFoundException,
  PAYLOAD_TO_LARGE_413,
  RESOURCE_NOT_ACCEPTABLE_406,
  BAD_REQUEST_400,
  FAILED_ON_SERIALIZATION_VALIDATION_500,
  INTERNAL_SERVER_ERROR_500,
  UNSUPPORTED_MEDIA_TYPE_415,
  TO_MANY_REQUESTS_429,
  CSRF_PROTECTION_403,
} from "#common/errors/index.js";
import { defaultHttpErrorCollection } from "#common/errors/default-http-error-collection.js";

/**
 * @param {Object} param
 * @param {import("fastify").FastifyError} param.fastifyError
 * @param {HttpErrorCollection} [param.errorCollectionOverride]
 */
const mapFastifyErrorToHttpErrorResponse = ({ fastifyError, errorCollectionOverride }) => {
  if (!fastifyError) return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
  if (fastifyError.validation) return defaultHttpErrorCollection[BAD_REQUEST_400.name];
  if (fastifyError.statusCode === 406) return defaultHttpErrorCollection[RESOURCE_NOT_ACCEPTABLE_406.name];
  if (fastifyError.statusCode === 413) return defaultHttpErrorCollection[PAYLOAD_TO_LARGE_413.name];
  if (fastifyError.statusCode === 415) return defaultHttpErrorCollection[UNSUPPORTED_MEDIA_TYPE_415.name];
  if (fastifyError.statusCode === 429) return defaultHttpErrorCollection[TO_MANY_REQUESTS_429.name];
  if (fastifyError.statusCode === 403) return defaultHttpErrorCollection[CSRF_PROTECTION_403.name];
  // it's our custom error, handle it by name
  if (typeof errorCollectionOverride !== "object")
    return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
  // @ts-ignore
  if (fastifyError.serialization) return defaultHttpErrorCollection[FAILED_ON_SERIALIZATION_VALIDATION_500.name];
  const mappedError = errorCollectionOverride[fastifyError.name];
  if (!mappedError) return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
  return mappedError;
};

/**
 * @param {Object} param
 * @param {import("fastify").FastifyError} param.fastifyError
 * @param {import('#types/index.js').HttpErrorResponseType} [param.httpErrorResponseTemplate]
 */
const formatErrorResponse = ({ fastifyError, httpErrorResponseTemplate }) => {
  if (!fastifyError || !httpErrorResponseTemplate?.developerMessage) return httpErrorResponseTemplate;
  return {
    ...httpErrorResponseTemplate,
    developerMessage: appConfig.isDeveloperMessageEnabled ? fastifyError.message : undefined,
  };
};

/**
 * @param {HttpErrorCollection} [errorCollectionOverride]
 */
const HttpFastifyErrorHandlerFactory =
  (errorCollectionOverride) =>
  /**
   * @param {import("fastify").FastifyError} fastifyError
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   */
  async (fastifyError, request, reply) => {
    logger.warn(fastifyError);

    const httpErrorResponseTemplate = mapFastifyErrorToHttpErrorResponse({
      fastifyError,
      errorCollectionOverride,
    });
    logger.warn(httpErrorResponseTemplate);
    const httpErrorResponse = formatErrorResponse({ fastifyError, httpErrorResponseTemplate });

    // Send error response
    reply.status(httpErrorResponse?.statusCode || 500).send(httpErrorResponse);
  };

/**
 * @param {HttpErrorCollection} [errorCollectionOverride]
 */
const WebSocketFastifyErrorHandlerFactory =
  (errorCollectionOverride) =>
  /**
   * @param {import("fastify").FastifyError} fastifyError
   */
  async (fastifyError) => {
    logger.warn(fastifyError);
    // TODO add mapFastifyErrorToWebSocketErrorResponse
    const httpErrorResponseTemplate = mapFastifyErrorToHttpErrorResponse({
      fastifyError,
      errorCollectionOverride,
    });

    logger.warn(httpErrorResponseTemplate);

    const errorResponse = formatErrorResponse({ fastifyError, httpErrorResponseTemplate });

    return {
      ...errorResponse,
      statusCode: errorResponse?.statusCode || 500,
    };
  };

/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export const globalHttpFastify404ErrorHandler = async (request, reply) => {
  const httpErrorResponse = defaultHttpErrorCollection[EndpointNotFoundException.name];

  httpErrorResponse.userMessage = `Endpoint '${request.method} ${request.url}' is not found`;
  httpErrorResponse.developerMessage = `Endpoint '${request.method} ${request.url}' is not found. Please, check is requested URI correct`;

  reply.status(httpErrorResponse.statusCode).send(httpErrorResponse); // Send error response
};

export const globalHttpFastifyErrorHandler = HttpFastifyErrorHandlerFactory(defaultHttpErrorCollection);
export const globalWebSocketFastifyErrorHandler = WebSocketFastifyErrorHandlerFactory(defaultHttpErrorCollection);
export const HttpErrorHandlerFactory = HttpFastifyErrorHandlerFactory;
export const WebSocketErrorHandlerFactory = WebSocketFastifyErrorHandlerFactory;
