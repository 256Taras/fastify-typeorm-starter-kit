import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ResourceNotFoundException,
  ResourceAlreadyExistException,
  ConflictException,
  UnprocessableEntityException,
  EndpointNotFoundException,
} from "#common/errors/common.errors.js";

export const defaultCommonErrorCollection = {
  [BadRequestException.name]: {
    code: 400000,
    statusCode: 400,
    userMessage: "Bad request",
    developerMessage: "Bad request",
  },
  [UnauthorizedException.name]: {
    code: 40100,
    statusCode: 401,
    userMessage: "Unauthorized",
    developerMessage: "JWT is not valid",
  },
  [ForbiddenException.name]: {
    code: 4003000,
    statusCode: 403,
    userMessage: "You do not have permission to access this resource",
    developerMessage: "Unable to access for this user",
  },
  [ResourceNotFoundException.name]: {
    code: 404000,
    statusCode: 404,
    userMessage: "Resource not found",
    developerMessage: "Resource not found",
  },
  [EndpointNotFoundException.name]: {
    code: 404001,
    statusCode: 404,
    userMessage: "Endpoint not found",
    developerMessage: "Endpoint not found",
  },
  [ResourceAlreadyExistException.name]: {
    code: 409000,
    statusCode: 409,
    userMessage: "Conflict",
    developerMessage: "Conflict",
  },
  [ConflictException.name]: {
    code: 409001,
    statusCode: 409,
    userMessage: "Conflict",
    developerMessage: "Conflict",
  },
  [UnprocessableEntityException.name]: {
    code: 422000,
    statusCode: 422,
    userMessage: "Unprocessable entity",
    developerMessage: "Unprocessable entity",
  },
};
