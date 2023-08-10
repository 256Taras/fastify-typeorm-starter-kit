import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createTestingApp, dbUtils } from "../../../helpers/index.js";

import { signUpFixtures as fixtures } from "./fixtures.js";

const TESTING_METHOD = "POST";

const getEndpoint = () => "/v1/auth/sing-up";

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

  it("[201] should  register a new user", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      payload: fixtures.positive.SIGN_UP.in.body,
      path: getEndpoint(),
    });

    const data = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(typeof data.accessToken, "string");
    assert.strictEqual(typeof data.refreshToken, "string");
    assert.strictEqual(typeof data.user.id, "string");
  });

  it("[409] should return an exception that a account with such mail already exists", async () => {
    await dbUtils.seed(fixtures.seeds.negative.EMAIL_ALREADY_EXIST);

    const response = await app.inject({
      method: TESTING_METHOD,
      payload: fixtures.negative.EMAIL_ALREADY_EXIST.in.body,
      path: getEndpoint(),
    });

    assert.strictEqual(response.statusCode, 409);
  });
});
