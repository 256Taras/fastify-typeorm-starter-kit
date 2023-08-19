// @ts-nocheck
/**
 * API layer errors/exceptions
 * Implement Fastify HTTP errors mapping
 */

/**
 * @typedef {import('./types/http-error-collection.interface').THttpErrorCollection} HttpErrorCollection
 */
import { requestContext } from "@fastify/request-context";

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
  // it's our custom error, handle it by name
  if (typeof errorCollectionOverride !== "object")
    return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
  // @ts-ignore
  if (fastifyError.serialization) return defaultHttpErrorCollection[FAILED_ON_SERIALIZATION_VALIDATION_500.name];
  const mappedError = errorCollectionOverride[fastifyError.name];
  console.log(mappedError)
  if (!mappedError) return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
  return mappedError;
};

function mapAjvErrorToUserFriendly(err) {
  if (err.code !== "FST_ERR_VALIDATION" || !err.validation || err.validation.length === 0) {
    return undefined;
  }

  const userFriendlyMessages = {
    required: (field) => `The field '${field}' is required.`,
    maxLength: (field, limit) => `The field '${field}' should be no longer than ${limit} characters.`,
    minLength: (field, limit) => `The field '${field}' should be at least ${limit} characters.`,
    format: (field, format) => {
      switch (format) {
        case "date":
          return `The field '${field}' should be in the correct date format.`;
        case "email":
          return `The field '${field}' should be in the correct email format.`;
        case "phone":
          return `The field '${field}' should be in the correct phone format.`;
        default:
          return null; // Return null for system formats like UUID
      }
    },
    pattern: (field) => `The field '${field}' does not match the specified pattern.`,
    type: (field, type) => `The field '${field}' should be of type '${type}'.`,
  };

  const errors = err.validation.map((validationError) => {
    let userMessage = null;

    if (validationError.keyword === "errorMessage") {
      userMessage = validationError.message;
    } else if (userFriendlyMessages[validationError.keyword]) {
      userMessage = userFriendlyMessages[validationError.keyword](
        validationError.params.missingProperty ?? validationError.instancePath.replace(/^\//, ""),
        validationError.params.limit ?? (validationError.params.format || validationError.params.type),
      );
    }

    if (userMessage) {
      return {
        type: "userMessage",
        message: userMessage,
        location: err.validationContext,
      };
    }

    // For unhandled user-friendly messages or system-level messages
    return {
      type: "developerMessage",
      message: validationError.message,
      location: err.validationContext,
    };
  });

  // eslint-disable-next-line consistent-return
  return errors;
}

/**
 * @param {Object} param
 * @param {import("fastify").FastifyError} param.fastifyError
 * @param {import('./types/http-error-response.interface').IHttpErrorResponse} [param.httpErrorResponseTemplate]
 */
const formatErrorResponse = ({ fastifyError, httpErrorResponseTemplate }) => {
  const errorDetails = mapAjvErrorToUserFriendly(fastifyError);

  if (!fastifyError || !httpErrorResponseTemplate?.developerMessage) return httpErrorResponseTemplate;

  return {
    traceId: requestContext.get("traceId"),
    errorDetails,
    ...httpErrorResponseTemplate,
    developerMessage: appConfig.isDeveloperMessageEnabled ? httpErrorResponseTemplate.developerMessage : undefined,
  };
};

/**
 * @param {HttpErrorCollection} [errorCollectionOverride]
 */
const HttpFastifyErrorHandlerFactory =
  (errorCollectionOverride) =>
  /**
   * @param {import("fastify").FastifyError} fastifyError
   * @param {import("fastify").FastifyRequest} _
   * @param {import("fastify").FastifyReply} reply
   */
  async (fastifyError, _, reply) => {
    logger.warn(fastifyError);

    const httpErrorResponseTemplate = mapFastifyErrorToHttpErrorResponse({
      fastifyError,
      errorCollectionOverride,
    });
    logger.warn(httpErrorResponseTemplate);
    const httpErrorResponse = formatErrorResponse({ fastifyError, httpErrorResponseTemplate });

    // Send error response
    reply.status(httpErrorResponse?.statusCode ?? 500).send(httpErrorResponse);
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
export const HttpErrorHandlerFactory = HttpFastifyErrorHandlerFactory;
