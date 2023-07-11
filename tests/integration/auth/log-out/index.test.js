import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createTestingApp, dbUtils } from "../../../helpers/index.js";
import { authService } from "../../mocks/auth/auth.service.js";

import { logOutFixtures as fixtures } from "./fixtures.js";

const TESTING_METHOD = "POST";

const getEndpoint = () => "/v1/auth/log-out";

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
    await dbUtils.reSeed(fixtures.seeds.common);
  });

  after(async () => {
    await teardown();
  });

  it("[200] should refresh token for a user", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      headers: fixtures.positive.LOG_OUT.in.headers,
      body: fixtures.positive.LOG_OUT.in.body,
      path: getEndpoint(),
    });

    const data = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(data.status, true);
  });

  it("[401] should be unauthorized", async () => {
    const response = await app.inject({
      method: TESTING_METHOD,
      headers: fixtures.negative.UNAUTHORIZED.in.headers,
      path: getEndpoint(),
    });

    assert.strictEqual(response.statusCode, 401);
  });
});
