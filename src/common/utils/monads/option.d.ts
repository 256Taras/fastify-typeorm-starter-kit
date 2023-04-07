import { Either } from "./either.js";

export declare abstract class Option<T> {
  abstract get(): T;

  abstract readonly isEmpty: boolean;

  match<U>(ifSome: (t: T) => U, ifNone: () => U): U;

  map<U>(mapper: (t: T) => U): Option<U>;

  replace<U>(val: U): Option<U>;

  getOrElse<U>(valIfEmpty: U): T | U;

  fold<U>(folder: (t: T) => U, ifEmpty: U): U;

  flatMap<U>(mapper: (t: T) => Option<U>): Option<U>;

  // eslint-disable-next-line no-use-before-define
  flatten(): T | None;

  orNull(): T | null;

  filter(pred: (t: T) => boolean): Option<T>;

  filterNot(pred: (t: T) => boolean): Option<T>;

  forEach(fn: (t: T) => void): void;

  exists(pred: (t: T) => boolean): boolean;

  forall(pred: (t: T) => boolean): boolean;

  contains(value: T): boolean;

  toEither<L>(leftValue: L): Either<L, T>;

  toString(): string;

  print(): void;

  // eslint-disable-next-line no-use-before-define
  static empty: () => None;

  // eslint-disable-next-line no-use-before-define
  static when: <T_1>(cond: boolean, value: T_1) => Option<T_1>;

  // eslint-disable-next-line no-use-before-define
  static unless: <T_1>(cond: boolean, value: T_1) => Option<T_1>;
}
export declare class Some<T> extends Option<T> {
  protected readonly value: T;

  constructor(value: T);

  readonly isEmpty = false;

  get(): T;
}
export declare class None extends Option<never> {
  readonly isEmpty = true;

  get(): never;
}
export declare const some: <T>(t: T) => Some<T>;
export declare const none: () => None;
