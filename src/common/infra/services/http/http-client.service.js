import { request } from "undici";
import * as querystring from "node:querystring";

import { HttpRequestError } from "#services/http/http-request.error.js";
import { UndiciResponse } from "#services/http/undici-response.js";

export class HttpClientService {
  get(path, options) {
    return this.request(path, { ...options, method: "GET" });
  }

  post(path, options) {
    return this.request(path, { ...options, method: "POST" });
  }

  put(path, options) {
    return this.request(path, { ...options, method: "PUT" });
  }

  patch(path, options) {
    return this.request(path, { ...options, method: "PATCH" });
  }

  delete(path, options) {
    return this.request(path, { ...options, method: "DELETE" });
  }

  options(path, options) {
    return this.request(path, { ...options, method: "OPTIONS" });
  }

  head(path, options) {
    return this.request(path, { ...options, method: "HEAD" });
  }

  async request(path, options) {
    // Construct url
    const url = new URL(options.basePath ? `${options.basePath}/${path}` : path);
    // Apply url search params
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(options.searchParams ?? {})) {
      // eslint-disable-next-line no-continue
      if (typeof value !== "string") continue;
      url.searchParams.set(key, value);
    }
    // Build http method
    const method = options.method ?? "GET";
    // Build http headers
    const headers = { ...options.headers };
    // Set content type based on json body
    if (options.jsonBody) headers["content-type"] = "application/json";
    // Set content type based on form body
    if (options.formBody) headers["content-type"] = "application/x-www-form-urlencoded";
    // Set authorization header based on username/password
    if (options.username && options.password) {
      const token = Buffer.from(`${options.username}:${options.password}`).toString("base64");
      headers.authorization = `Basic ${token}`;
    }
    // Build http body
    // eslint-disable-next-line no-nested-ternary
    const body = options.jsonBody
      ? JSON.stringify(options.jsonBody)
      : options.formBody
      ? querystring.stringify(options.formBody)
      : options.body;
    const res = await request(url, {
      method,
      headers,
      body,
      headersTimeout: options.firstByteTimeout ?? options.requestTimeout,
      bodyTimeout: options.requestTimeout,
      idempotent: options.idempotent,
      maxRedirections: options.maxRedirections,
    });

    if (res.statusCode >= 400) {
      throw new HttpRequestError(url, options, res, await res.body.text());
    }

    return new UndiciResponse(res);
  }
}
