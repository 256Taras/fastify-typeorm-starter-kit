// @ts-nocheck
/**
 * API layer errors/exceptions
 * Implement Fastify HTTP errors mapping
 */

/**
 * @typedef {import('./types/http-error-collection.interface').THttpErrorCollection} HttpErrorCollection
 */
import { requestContext } from "@fastify/request-context";

import {
  EndpointNotFoundException,
  PAYLOAD_TO_LARGE_413,
  RESOURCE_NOT_ACCEPTABLE_406,
  BAD_REQUEST_400,
  FAILED_ON_SERIALIZATION_VALIDATION_500,
  INTERNAL_SERVER_ERROR_500,
  UNSUPPORTED_MEDIA_TYPE_415,
  TO_MANY_REQUESTS_429,
  INVALID_JSON_SYNTAX_400,
} from "#common/errors/index.js";
import { defaultHttpErrorCollection } from "#common/errors/default-http-error-collection.js";
import { appConfig } from "#src/configs/index.js";
import { logger } from "#common/infra/services/logger/logger.service.js";

/**
 * @param {Object} param
 * @param {import("fastify").FastifyError} param.fastifyError
 * @param {HttpErrorCollection} [param.errorCollectionOverride]
 */
const mapFastifyErrorToHttpErrorResponse = ({ fastifyError, errorCollectionOverride }) => {
  if (!fastifyError) return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];

  if (fastifyError.validation) return defaultHttpErrorCollection[BAD_REQUEST_400.name];

  switch (fastifyError.statusCode) {
    case 400:
      return defaultHttpErrorCollection[INVALID_JSON_SYNTAX_400.name];
    case 406:
      return defaultHttpErrorCollection[RESOURCE_NOT_ACCEPTABLE_406.name];
    case 413:
      return defaultHttpErrorCollection[PAYLOAD_TO_LARGE_413.name];
    case 415:
      return defaultHttpErrorCollection[UNSUPPORTED_MEDIA_TYPE_415.name];
    case 429:
      return defaultHttpErrorCollection[TO_MANY_REQUESTS_429.name];
    default:
      if (typeof errorCollectionOverride !== "object") {
        return defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
      }
      if (fastifyError.serialization) {
        return defaultHttpErrorCollection[FAILED_ON_SERIALIZATION_VALIDATION_500.name];
      }
      // eslint-disable-next-line no-case-declarations
      const mappedError = errorCollectionOverride[fastifyError.name];
      return mappedError ?? defaultHttpErrorCollection[INTERNAL_SERVER_ERROR_500.name];
  }
};

const USER_MESSAGES = {
  required: () => `Field is required`,
  maxLength: (_, limit) => `Field should be no longer than ${limit} characters`,
  minLength: (_, limit) => `Field should be at least ${limit} characters`,
  pattern: () => `Field does not match the required format`,
};

const formatErrorMessage = (validationError, field) => {
  if (validationError.keyword === "errorMessage") {
    return validationError.message;
  }

  const formatter = USER_MESSAGES[validationError.keyword];
  if (!formatter) return null;

  const additionalParam =
    validationError.params.limit ?? (validationError.params.format || validationError.params.type);

  if (validationError.keyword === "format" && ["date", "email", "phone"].includes(additionalParam)) {
    return `Should be in the correct ${additionalParam} format.`;
  }

  return formatter(field, additionalParam);
};

function mapAjvErrorToUserFriendly(err) {
  if (err.code !== "FST_ERR_VALIDATION" || !err.validation || err.validation.length === 0) {
    return undefined;
  }

  // eslint-disable-next-line consistent-return
  return err.validation.map((validationError) => {
    const field = validationError.params.missingProperty ?? validationError.instancePath.replace(/^\//, "");
    const userMessage = formatErrorMessage(validationError, field);
    if (userMessage) {
      return {
        type: "userMessage",
        message: userMessage,
        location: err.validationContext,
        field,
      };
    }

    return {
      type: "developerMessage",
      message: validationError.message,
      location: err.validationContext,
      field,
    };
  });
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
    const httpErrorResponse = formatErrorResponse({ fastifyError, httpErrorResponseTemplate });
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
  reply.status(httpErrorResponse.statusCode).send(httpErrorResponse);
};

export const globalHttpFastifyErrorHandler = HttpFastifyErrorHandlerFactory(defaultHttpErrorCollection);
export const HttpErrorHandlerFactory = HttpFastifyErrorHandlerFactory;
