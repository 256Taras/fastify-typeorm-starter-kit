export class UnknownDbError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnknownDbError";
  }
}

export class NotNullException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotNullException";
  }
}

export class ForeignKeyViolationException extends Error {
  constructor(message) {
    super(message);
    this.name = "ForeignKeyViolationException";
  }
}

export class UniqueViolationException extends Error {
  constructor(message) {
    super(message);
    this.name = "UniqueViolationException";
  }
}

export class CheckViolationException extends Error {
  constructor(message) {
    super(message);
    this.name = "CheckViolationException";
  }
}

export const mapPgError = (error) => {
  if (!error || !error?.code) return new UnknownDbError(error);
  switch (error.code) {
    case "23502": {
      return new NotNullException(error);
    }
    case "23503": {
      return new ForeignKeyViolationException(error);
    }
    case "23505": {
      return new UniqueViolationException(error);
    }
    case "23514": {
      return new CheckViolationException(error);
    }
    default: {
      return new UnknownDbError(error);
    }
  }
};

export const mapDbError = mapPgError;
