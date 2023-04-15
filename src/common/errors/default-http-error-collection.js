import {
  BAD_REQUEST_400,
  CSRF_PROTECTION_403,
  FAILED_ON_SERIALIZATION_VALIDATION_500,
  INTERNAL_SERVER_ERROR_500,
  PAYLOAD_TO_LARGE_413,
  RESOURCE_NOT_ACCEPTABLE_406,
  SERVICE_UNAVAILABLE_EXCEPTION_503,
  TO_MANY_REQUESTS_429,
  UNSUPPORTED_MEDIA_TYPE_415,
} from "#common/errors/http.errors.js";
import { defaultCommonErrorCollection } from "#common/errors/default-common-error-collection.js";

export const defaultHttpErrorCollection = {
  ...defaultCommonErrorCollection,
  [BAD_REQUEST_400.name]: {
    code: 400000,
    statusCode: 400,
    userMessage: "Bad request",
    developerMessage: "Bad request",
  },
  [CSRF_PROTECTION_403.name]: {
    code: 4003001,
    statusCode: 403,
    userMessage: "Your session has timed out, you need to log in",
    developerMessage: "Csrf protection",
  },
  [RESOURCE_NOT_ACCEPTABLE_406.name]: {
    code: 406000,
    statusCode: 406,
    userMessage: "Not acceptable",
    developerMessage: "Not acceptable",
  },

  [PAYLOAD_TO_LARGE_413.name]: {
    code: 413000,
    statusCode: 413,
    userMessage: "Payload too large",
    developerMessage: "Payload too large",
  },
  [UNSUPPORTED_MEDIA_TYPE_415.name]: {
    code: 415000,
    statusCode: 415,
    userMessage: "Unsupported media type",
    developerMessage: "Unsupported media type",
  },
  [TO_MANY_REQUESTS_429.name]: {
    code: 429000,
    statusCode: 429,
    userMessage: "Too many requests",
    developerMessage: "Too many requests",
  },
  [INTERNAL_SERVER_ERROR_500.name]: {
    code: 500000,
    statusCode: 500,
    userMessage: "Internal server error",
    developerMessage: "Server is on coffee time",
  },
  [FAILED_ON_SERIALIZATION_VALIDATION_500.name]: {
    code: 500002,
    statusCode: 500,
    userMessage: "Internal server error",
    developerMessage: "Failed on serialization validation",
  },
  [SERVICE_UNAVAILABLE_EXCEPTION_503.name]: {
    code: 503000,
    statusCode: 503,
    userMessage: "Service Unavailable",
    developerMessage: "Service Unavailable",
  },
};
