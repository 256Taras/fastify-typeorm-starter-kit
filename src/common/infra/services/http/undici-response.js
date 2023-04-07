export class UndiciResponse {
  constructor(response) {
    this.raw = response;
    this.headers = response.headers;
    this.body = response.body;
    this.trailers = response.trailers;
    this.status = response.statusCode;
  }

  ok() {
    return this.status >= 200 && this.status < 300;
  }

  json() {
    return this.body.json();
  }

  text() {
    return this.body.text();
  }
}
