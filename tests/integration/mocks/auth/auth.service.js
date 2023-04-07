import { diContainer } from "@fastify/awilix";

import { ROLES_NAMES } from "#constants";
import { JwtDecodingError } from "#errors";

import { authConfig } from "#configs";
import {
  AUTHORIZED_MOCK_USER_ID,
  EMAIL,
  FIRSTNAME,
  LASTNAME,
  PPID,
  REFRESH_TOKEN_ID,
} from "../users/constants.js";

export const authService = {
  verifyJwt: async ({ headers }) => {
    const token = headers.authorization;

    if (!token || (typeof token === "string" && !token.includes("Bearer"))) {
      throw new JwtDecodingError("Token is missing");
    }

    // @ts-ignore
    diContainer.cradle.userContext.set({
      id: AUTHORIZED_MOCK_USER_ID,
      email: EMAIL,
      firstName: FIRSTNAME,
      lastName: LASTNAME,
      roles: [ROLES_NAMES.user],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
  verifyJwtRefreshToken: async (req) => {
    if (!req.cookies[authConfig.cookieKeys.refreshToken]) {
      throw new JwtDecodingError("Token is missing");
    }
    diContainer.cradle.userRefreshTokenContext.set({
      ppid: PPID,
      id: AUTHORIZED_MOCK_USER_ID,
      refreshTokenId: REFRESH_TOKEN_ID,
    });
  },
};
