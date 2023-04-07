export class BAD_REQUEST_400 extends Error {
  constructor(message) {
    super(message);
    this.name = "BAD_REQUEST_400";
  }
}
export class NOT_FOUND_404 extends Error {
  constructor(message) {
    super(message);
    this.name = "NOT_FOUND_404";
  }
}
export class NOT_ACCEPTABLE_406 extends Error {
  constructor(message) {
    super(message);
    this.name = "NOT_ACCEPTABLE_406";
  }
}
export class INTERNAL_SERVER_ERROR_500 extends Error {
  constructor(message) {
    super(message);
    this.name = "INTERNAL_SERVER_ERROR_500";
  }
}

export class FAILED_ON_SERIALIZATION_VALIDATION_500 extends Error {
  constructor(message) {
    super(message);
    this.name = "FAILED_ON_SERIALIZATION_VALIDATION_500";
  }
}

export class UNSUPPORTED_MEDIA_TYPE extends Error {
  constructor(message) {
    super(message);
    this.name = "UNSUPPORTED_MEDIA_TYPE";
  }
}

export class TO_MANY_REQUESTS extends Error {
  constructor(message) {
    super(message);
    this.name = "TO_MANY_REQUESTS";
  }
}

export class CSRF_PROTECTION extends Error {
  constructor(message) {
    super(message);
    this.name = "CSRF_PROTECTION";
  }
}
