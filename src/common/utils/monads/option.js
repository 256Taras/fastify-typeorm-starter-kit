import { logger } from "#services/logger/logger.service.js";
// eslint-disable-next-line import/no-cycle
import { left, right } from "./either.js";

export class Option {
  isEmpty;

  constructor({ isEmpty }) {
    this.isEmpty = isEmpty;
  }

  get() {
    throw new Error("Method not implemented");
  }

  match(ifSome, ifNone) {
    return this.isEmpty ? ifNone() : ifSome(this.get());
  }

  map(mapper) {
    return this.isEmpty ? none() : some(mapper(this.get()));
  }

  replace(val) {
    return this.map(() => val);
  }

  getOrElse(valIfEmpty) {
    return this.isEmpty ? valIfEmpty : this.get();
  }

  fold(folder, ifEmpty) {
    return this.map(folder).getOrElse(ifEmpty);
  }

  flatMap(mapper) {
    return this.fold(mapper, none());
  }

  flatten() {
    return this.getOrElse(none());
  }

  orNull() {
    return this.getOrElse(null);
  }

  filter(pred) {
    // eslint-disable-next-line no-use-before-define
    return !this.isEmpty && pred(this.get()) ? this : none();
  }

  filterNot(pred) {
    return this.filter((t) => !pred(t));
  }

  forEach(fn) {
    if (!this.isEmpty) {
      fn(this.get());
    }
  }

  exists(pred) {
    return this.isEmpty ? false : pred(this.get());
  }

  forall(pred) {
    return this.isEmpty ? true : pred(this.get());
  }

  contains(value) {
    return this.exists((t) => t === value);
  }

  toEither(leftValue) {
    return this.match(
      (t) => right(t),
      () => left(leftValue),
    );
  }

  toString() {
    return this.fold((t) => `Some(${String(t)})`, "None");
  }

  print() {
    logger.debug(this.toString());
  }

  static empty = () => none();

  static when = (cond, value) => (cond ? some(value) : none());

  static unless = (cond, value) => Option.when(!cond, value);
}
export class Some extends Option {
  constructor(value) {
    super({ isEmpty: false });
    this.value = value;
  }

  get() {
    return this.value;
  }
}
export class None extends Option {
  constructor() {
    super({ isEmpty: true });
  }

  get() {
    throw new Error("Tried to get value of None");
  }
}

// eslint-disable-next-line no-use-before-define
export function some(t) {
  return new Some(t);
}
// @ts-ignore
// eslint-disable-next-line no-use-before-define
export function none() {
  return new None();
}
