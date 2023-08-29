import EncrypterService from "#common/infra/services/encrypter/encrypter.service.js";
import { ROLES_NAMES } from "#common/constants/index.js";

import { fixtureFactory } from "../../../helpers/index.js";
import {
  FIRSTNAME,
  LASTNAME,
  PASSWORD,
  EMAIL,
  AUTHORIZED_MOCK_USER_ID,
  INVALID_MOCK_AUTH_HEADER,
  PPID,
  REFRESH_TOKEN_ID,
} from "../../mocks/users/constants.js";

export const refreshTokensFixtures = fixtureFactory({
  seeds: {
    common: {
      USER: {
        name: "User",
        data: [
          {
            id: AUTHORIZED_MOCK_USER_ID,
            email: EMAIL,
            // @ts-ignore
            password: await new EncrypterService().getHash(PASSWORD),
            firstName: FIRSTNAME,
            lastName: LASTNAME,
            roles: [ROLES_NAMES.user],
          },
        ],
      },
      AUTH_TOKEN: {
        name: "AuthToken",
        data: [
          {
            id: REFRESH_TOKEN_ID,
            ppid: PPID,
            userId: AUTHORIZED_MOCK_USER_ID,
          },
        ],
      },
    },
  },
  positive: {
    REFRESH_TOKENS: {
      in: {
        body: {
          refreshToken: `tokenValue`,
        },
      },
    },
  },
  negative: {
    UNAUTHORIZED: {
      in: {
        headers: {
          authorization: INVALID_MOCK_AUTH_HEADER,
        },
      },
    },
  },
});
