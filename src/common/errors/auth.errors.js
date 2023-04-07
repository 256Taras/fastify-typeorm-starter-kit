export class JwtDecodingError extends Error {
  constructor(message) {
    super(message);
    this.name = "JwtDecodingError";
  }
}

export class InvalidApiKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidApiKeyError";
  }
}
