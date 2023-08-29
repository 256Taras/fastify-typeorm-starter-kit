import EncrypterService from "#common/infra/services/encrypter/encrypter.service.js";
import { ROLES_NAMES } from "#common/constants.js";

import { fixtureFactory } from "../../../helpers/index.js";
import { FIRSTNAME, LASTNAME, PASSWORD, EMAIL, AUTHORIZED_MOCK_USER_ID } from "../../mocks/users/constants.js";

const COMMON_BODY = {
  email: EMAIL,
  password: PASSWORD,
  firstName: FIRSTNAME,
  lastName: LASTNAME,
};
export const signUpFixtures = fixtureFactory({
  seeds: {
    negative: {
      EMAIL_ALREADY_EXIST: {
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
    },
  },
  positive: {
    SIGN_UP: {
      in: {
        body: COMMON_BODY,
      },
      out: {
        status: { status: true },
      },
    },
  },
  negative: {
    EMAIL_ALREADY_EXIST: {
      in: {
        body: COMMON_BODY,
      },
    },
  },
});
