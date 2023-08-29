import EncrypterService from "#common/infra/services/encrypter/encrypter.service.js";
import { ROLES_NAMES } from "#common/constants.js";

import {
  FIRSTNAME,
  LASTNAME,
  PASSWORD,
  EMAIL,
  AUTHORIZED_MOCK_USER_ID,
  VALID_MOCK_AUTH_TOKEN,
  INVALID_MOCK_AUTH_HEADER,
} from "../../mocks/users/constants.js";
import { fixtureFactory } from "../../../helpers/index.js";

const createdAt = new Date().toISOString();
const updatedAt = new Date().toISOString();

export const profileFixtures = fixtureFactory({
  seeds: {
    positive: {},
    negative: {},
    common: {
      ACCOUNT: {
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
            createdAt,
            updatedAt,
          },
        ],
      },
    },
  },
  positive: {
    USER_PROFILE: {
      in: {
        headers: {
          authorization: VALID_MOCK_AUTH_TOKEN,
        },
      },
      out: {
        id: AUTHORIZED_MOCK_USER_ID,
        email: EMAIL,
        firstName: FIRSTNAME,
        lastName: LASTNAME,
        roles: [ROLES_NAMES.user],
        createdAt,
        updatedAt,
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
