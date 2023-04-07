import { env } from "../../configs/env.js";

export const fastifyJwtConfig = {
  accessTokenSecret: env.JWT_ACCESS_TOKEN_SECRET || "jwt",
  accessTokenExpirationTime: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refreshTokenSecret: env.JWT_REFRESH_TOKEN_SECRET || "jwt",
  refreshTokenExpirationTime: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  messages: {
    noAuthorizationInCookieMessage: "You are not authorized to access",
    authorizationTokenExpiredMessage: "You are not authorized to access",
    authorizationTokenInvalid: "You are not authorized to access",
    authorizationTokenUntrusted: "You are not authorized to access",
  },
};
