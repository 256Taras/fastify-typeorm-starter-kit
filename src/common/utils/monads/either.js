// eslint-disable-next-line import/no-cycle
import { logger } from "#services/logger/logger.service.js";
// eslint-disable-next-line import/no-cycle
import { some, none } from "./option.js";

export class Either {
  constructor() {
    // eslint-disable-next-line no-use-before-define
    this.left = new LeftProjection(this);
  }

  isLeft() {
    // @ts-ignore
    return !this.isRight();
  }

  match(ifLeft, ifRight) {
    // @ts-ignore
    return this.isRight() ? ifRight(this.get()) : ifLeft(this.leftGet());
  }

  map(mapper) {
    // @ts-ignore
    // eslint-disable-next-line no-use-before-define
    return this.isRight() ? new Right(mapper(this.get())) : this.asInstanceOfLeft();
  }

  replace(val) {
    return this.map(() => val);
  }

  getOrElse(valIfLeft) {
    // @ts-ignore
    return this.isLeft() ? valIfLeft : this.get();
  }

  fold(fa, fb) {
    // @ts-ignore
    return this.isRight() ? fa(this.get()) : fb(this.leftGet());
  }

  flatMap(mapper) {
    // @ts-ignore
    // eslint-disable-next-line no-use-before-define
    return this.isRight() ? mapper(this.get()) : new Left(this.leftGet());
  }

  flatten() {
    // @ts-ignore
    return this.isRight() ? this.get() : this.asInstanceOfLeft();
  }

  orNull() {
    return this.getOrElse(null);
  }

  filterOrElse(pred, orElse) {
    // @ts-ignore
    if (this.isRight() && pred(this.get())) return this;
    // @ts-ignore
    // eslint-disable-next-line no-use-before-define
    if (this.isRight()) return new Left(orElse);
    // @ts-ignore
    return this.asInstanceOfLeft();
  }

  forEach(fn) {
    // @ts-ignore
    if (this.isRight()) {
      // @ts-ignore
      fn(this.get());
    }
  }

  exists(pred) {
    // @ts-ignore
    return this.isLeft() ? false : pred(this.get());
  }

  forall(pred) {
    // @ts-ignore
    return this.isLeft() ? true : pred(this.get());
  }

  contains(value) {
    return this.exists((t) => t === value);
  }

  toOption() {
    return this.match(
      () => none,
      (r) => some(r),
    );
  }

  toString() {
    return this.fold(
      (r) => `Right(${String(r)})`,
      (l) => `Left(${String(l)})`,
    );
  }

  print() {
    logger.debug(this.toString());
  }
}
// eslint-disable-next-line no-use-before-define
Either.when = (cond, right, left) => (cond ? new Right(right) : new Left(left));
Either.unless = (cond, right, left) => Either.when(!cond, right, left);
export class Right extends Either {
  constructor(value) {
    super();
    this.isRight = () => true;
    this.value = value;
  }

  get() {
    return this.value;
  }

  leftGet() {
    throw new Error("Tried to get value of a Left");
  }

  asInstanceOfLeft() {
    throw new Error("Tried to get Right as an instance of Left");
  }

  asInstanceOfRight() {
    return this;
  }

  promise() {
    return Promise.resolve(this.value);
  }
}
export class Left extends Either {
  constructor(value) {
    super();
    this.isRight = () => false;
    this.value = value;
  }

  get() {
    throw new Error("Tried to get value of Left");
  }

  leftGet() {
    return this.value;
  }

  asInstanceOfLeft() {
    return this;
  }

  asInstanceOfRight() {
    throw new Error("Tried to get Left as an instance of Right");
  }
}
class LeftProjection {
  constructor(either) {
    this.either = either;
  }

  get() {
    return this.either.match(
      (l) => l,
      () => {
        throw new Error("Tried to call left-projected Right");
      },
    );
  }

  map(mapper) {
    return this.either.match(
      (l) => new Left(mapper(l)),
      () => this.either.asInstanceOfRight(),
    );
  }

  replace(val) {
    return this.map(() => val);
  }

  getOrElse(valIfRight) {
    return this.either.match(
      (l) => l,
      () => valIfRight,
    );
  }

  flatMap(mapper) {
    return this.either.match(
      (l) => mapper(l),
      () => this.either.asInstanceOfRight(),
    );
  }

  flatten() {
    return this.either.match(
      (l) => l,
      () => this.either.asInstanceOfRight(),
    );
  }

  orNull() {
    return this.getOrElse(null);
  }

  filterOrElse(pred, orElse) {
    return this.either.match(
      (l) => (pred(l) ? this.either.asInstanceOfLeft() : new Right(orElse)),
      () => this.either.asInstanceOfRight(),
    );
  }

  forEach(fn) {
    this.either.match(
      (l) => fn(l),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
    );
  }

  exists(pred) {
    return this.either.match(
      (l) => pred(l),
      () => false,
    );
  }

  forall(pred) {
    return this.either.match(
      (l) => pred(l),
      () => true,
    );
  }

  contains(value) {
    return this.exists((t) => t === value);
  }

  toOption() {
    return this.either.match(
      (l) => some(l),
      () => none,
    );
  }
}
export const right = (t) => new Right(t);
export const left = (t) => new Left(t);
export const tryCatch = (onSuccess, onError) => {
  try {
    return new Left(onSuccess());
  } catch (e) {
    return new Left(onError(e));
  }
};
