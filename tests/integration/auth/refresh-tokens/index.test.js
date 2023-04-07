import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { refreshTokensFixtures as fixtures } from "./fixtures.js";
import { createTestingApp, dbUtils } from "../../../helpers/index.js";
import { authService } from "../../mocks/auth/auth.service.js";

const TESTING_METHOD = "PUT";

const getEndpoint = () => "/v1/auth/refresh-tokens";

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
      headers: fixtures.positive.REFRESH_TOKENS.in.headers,
      path: getEndpoint(),
    });

    const data = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(typeof data.accessToken, "string");
    assert.strictEqual(typeof data.user.id, "string");
    // @ts-ignore
    assert.match(response.headers["set-cookie"], /^x-refresh-token=/);
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
