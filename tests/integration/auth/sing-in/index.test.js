import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createTestingApp, dbUtils } from "../../../helpers/index.js";

import { signInFixtures as fixtures } from "./fixtures.js";

const TESTING_METHOD = "POST";

const getEndpoint = () => "/v1/auth/sing-in";

describe(`${TESTING_METHOD}-${getEndpoint()}`, () => {
  let app;
  let teardown;

  before(async () => {
    const payload = await createTestingApp();
    app = payload.app;
    teardown = payload.teardown;
  });

  beforeEach(async () => {
    await dbUtils.cleanUp();
  });

  after(async () => {
    await teardown();
  });

  it("[201] should login in user account", async () => {
    await dbUtils.seed(fixtures.seeds.positive.ACCOUNT);

    const response = await app.inject({
      method: TESTING_METHOD,
      payload: fixtures.positive.SIGN_IN.in.body,
      path: getEndpoint(),
    });

    const data = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(typeof data.accessToken, "string");
    assert.strictEqual(typeof data.refreshToken, "string");
    assert.strictEqual(typeof data.user.id, "string");
  });

  it("[404] should return an exception that a user with such mail does not exist", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      payload: fixtures.negative.EMAIL_NOT_EXIST.in.body,
      path: getEndpoint(),
    });

    assert.strictEqual(response.statusCode, 404);
  });
});
