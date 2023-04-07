import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { profileFixtures as fixtures } from "./fixtures.js";

import { authService } from "../../mocks/auth/auth.service.js";
import { createTestingApp, dbUtils } from "../../../helpers/index.js";

const TESTING_METHOD = "GET";

const getEndpoint = () => "/v1/users/profile";

describe(`${TESTING_METHOD}-${getEndpoint()}`, () => {
  let app;
  let teardown;

  before(async () => {
    const payload = await createTestingApp({
      infra: {
        authService,
      },
    });
    app = payload.app;
    teardown = payload.teardown;
  });

  beforeEach(async () => {
    await dbUtils.cleanUp();
    await dbUtils.seed(fixtures.seeds.common.ACCOUNT);
  });

  after(async () => {
    await teardown();
  });

  it("[200] should get authorize user profile", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      path: getEndpoint(),
      headers: fixtures.positive.USER_PROFILE.in.headers,
    });

    const data = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(data.password, undefined);
    assert.deepStrictEqual(data, fixtures.positive.USER_PROFILE.out);
  });

  it("[401] should be unauthorized", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      path: getEndpoint(),
      headers: fixtures.negative.UNAUTHORIZED.in.headers,
    });

    assert.strictEqual(response.statusCode, 401);
  });
});
