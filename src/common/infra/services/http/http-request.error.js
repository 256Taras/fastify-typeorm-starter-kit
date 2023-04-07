export class HttpRequestError extends Error {
  constructor(url, request, response, body) {
    super(`${request.method} ${url.href} ${response.statusCode} ${body}`);
    this.statusCode = response.statusCode;
    this.headers = response.headers;
    this.body = body;
    this.request = request;
    this.response = response;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body,
      stack: this.stack,
    };
  }
}
