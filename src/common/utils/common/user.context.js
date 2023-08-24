import { requestContext } from "@fastify/request-context";

import { TOKENS } from "#constants";

/**
 *  Fastify wrapper on AsyncLocalStorage
 */

export const userContext = {
  get() {
    // @ts-ignore
    return requestContext.get(TOKENS.userJwtData);
  },
  set(value) {
    // @ts-ignore
    requestContext.set(TOKENS.userJwtData, value);
  },
};

export const userRefreshTokenContext = {
  get() {
    // @ts-ignore
    return requestContext.get(TOKENS.userCredentials);
  },
  set(value) {
    // @ts-ignore
    requestContext.set(TOKENS.userCredentials, value);
  },
};
