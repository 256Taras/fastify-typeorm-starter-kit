import {
  BAD_REQUEST_400,
  CSRF_PROTECTION,
  FAILED_ON_SERIALIZATION_VALIDATION_500,
  INTERNAL_SERVER_ERROR_500,
  TO_MANY_REQUESTS,
  UNSUPPORTED_MEDIA_TYPE,
} from "#common/errors/http.errors.js";

import {
  BadCredentialsException,
  BadRequestException,
  ConflictException,
  EndpointNotFoundException,
  ForbiddenException,
  PayloadTooLargeException,
  ResourceAlreadyExistException,
  ResourceGoneException,
  ResourceNotAcceptableException,
  ResourceNotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "#common/errors/common.errors.js";

import { InvalidApiKeyError, JwtDecodingError } from "#common/errors/auth.errors.js";

export const defaultHttpErrorCollection = {
  [BAD_REQUEST_400.name]: {
    code: 400000,
    httpStatusCode: 400,
    userMessage: "Bad request",
    developerMessage: "Bad request",
  },
  [BadRequestException.name]: {
    code: 400000,
    httpStatusCode: 400,
    userMessage: "Bad request",
    developerMessage: "Bad request",
  },
  [JwtDecodingError.name]: {
    code: 401000,
    httpStatusCode: 401,
    userMessage: "Unauthorized",
    developerMessage: "JWT is not valid",
  },
  [UnauthorizedException.name]: {
    code: 40100,
    httpStatusCode: 401,
    userMessage: "Unauthorized",
    developerMessage: "JWT is not valid",
  },
  [InvalidApiKeyError.name]: {
    code: 401001,
    httpStatusCode: 401,
    userMessage: "Unauthorized",
    developerMessage: "Api key is not valid",
  },
  [ForbiddenException.name]: {
    code: 4003000,
    httpStatusCode: 403,
    userMessage: "You do not have permission to access this resource",
    developerMessage: "Unable to access for this user",
  },
  [BadCredentialsException.name]: {
    code: 4003001,
    httpStatusCode: 403,
    userMessage: "You do not have permission to access this resource",
    developerMessage: "Access denied",
  },
  [CSRF_PROTECTION.name]: {
    code: 4003001,
    httpStatusCode: 403,
    userMessage: "Your session has timed out, you need to log in",
    developerMessage: "Csrf protection",
  },
  [ResourceNotFoundException.name]: {
    code: 404000,
    httpStatusCode: 404,
    userMessage: "Resource not found",
    developerMessage: "Resource not found",
  },
  [EndpointNotFoundException.name]: {
    code: 404001,
    httpStatusCode: 404,
    userMessage: "Endpoint not found",
    developerMessage: "Endpoint not found",
  },
  [ResourceNotAcceptableException.name]: {
    code: 406000,
    httpStatusCode: 406,
    userMessage: "Not acceptable",
    developerMessage: "Not acceptable",
  },
  [ResourceAlreadyExistException.name]: {
    code: 409000,
    httpStatusCode: 409,
    userMessage: "Conflict",
    developerMessage: "Conflict",
  },
  [ConflictException.name]: {
    code: 409001,
    httpStatusCode: 409,
    userMessage: "Conflict",
    developerMessage: "Conflict",
  },
  [ResourceGoneException.name]: {
    code: 401000,
    httpStatusCode: 410,
    userMessage: "Gone",
    developerMessage: "Gone",
  },
  [PayloadTooLargeException.name]: {
    code: 413000,
    httpStatusCode: 413,
    userMessage: "Payload too large",
    developerMessage: "Payload too large",
  },
  [UNSUPPORTED_MEDIA_TYPE.name]: {
    code: 415000,
    httpStatusCode: 415,
    userMessage: "Unsupported media type",
    developerMessage: "Unsuported media type",
  },
  [UnprocessableEntityException.name]: {
    code: 422000,
    httpStatusCode: 422,
    userMessage: "Unprocessable entity",
    developerMessage: "Unprocessable entity",
  },
  [TO_MANY_REQUESTS.name]: {
    code: 429000,
    httpStatusCode: 429,
    userMessage: "Too many requests",
    developerMessage: "Too many requests",
  },
  [INTERNAL_SERVER_ERROR_500.name]: {
    code: 500000,
    httpStatusCode: 500,
    userMessage: "Internal server error",
    developerMessage: "Server is on coffee time",
  },
  [FAILED_ON_SERIALIZATION_VALIDATION_500.name]: {
    code: 500002,
    httpStatusCode: 500,
    userMessage: "Internal server error",
    developerMessage: "Failed on serialization validation",
  },
  [ServiceUnavailableException.name]: {
    code: 503000,
    httpStatusCode: 503,
    userMessage: "Service Unavailable",
    developerMessage: "Service Unavailable",
  },
};
