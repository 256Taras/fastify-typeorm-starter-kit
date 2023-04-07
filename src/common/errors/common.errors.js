export class ResourceNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceNotFoundException";
  }

  static of(message) {
    return Promise.reject(new ResourceNotFoundException(message));
  }
}

export class EndpointNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointNotFoundException";
  }

  static of(message) {
    return Promise.reject(new EndpointNotFoundException(message));
  }
}

export class ResourceAlreadyExistException extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceAlreadyExistException";
  }

  static of(message) {
    return Promise.reject(new ResourceAlreadyExistException(message));
  }
}

export class BadCredentialsException extends Error {
  constructor(message) {
    super(message);
    this.name = "BadCredentialsException";
  }

  static of(message) {
    return Promise.reject(new BadCredentialsException(message));
  }
}

export class InvalidArgumentException extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidArgumentException";
  }

  static of(message) {
    return Promise.reject(new InvalidArgumentException(message));
  }
}

export class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestException";
  }

  static of(message) {
    return Promise.reject(new BadRequestException(message));
  }
}

export class UnauthorizedException extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedException";
  }

  static of(message) {
    return Promise.reject(new UnauthorizedException(message));
  }
}

export class ForbiddenException extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenException";
  }

  static of(message) {
    return Promise.reject(new ForbiddenException(message));
  }
}

export class ResourceNotAcceptableException extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceNotAcceptableException";
  }

  static of(message) {
    return Promise.reject(new ResourceNotAcceptableException(message));
  }
}

export class ConflictException extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictException";
  }

  static of(message) {
    return Promise.reject(new ConflictException(message));
  }
}

export class ResourceGoneException extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceGoneException";
  }

  static of(message) {
    return Promise.reject(new ResourceGoneException(message));
  }
}

export class PayloadTooLargeException extends Error {
  constructor(message) {
    super(message || "Payload too large");
    this.name = "PayloadTooLargeException";
  }

  static of(message) {
    return Promise.reject(new PayloadTooLargeException(message));
  }
}

export class UnprocessableEntityException extends Error {
  constructor(message) {
    super(message);
    this.name = "UnprocessableEntityException";
  }

  static of(message) {
    return Promise.reject(new UnprocessableEntityException(message));
  }
}

export class ServiceUnavailableException extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceUnavailableException";
  }

  static of(message) {
    return Promise.reject(new ServiceUnavailableException(message));
  }
}
