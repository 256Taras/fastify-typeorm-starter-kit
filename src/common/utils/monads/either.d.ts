/* eslint-disable */
import { Option } from "./option.js";

export declare abstract class Either<L, R> {
  abstract isRight(): this is Right<L, R>;

  abstract get(): R;

  abstract asInstanceOfLeft<T = R>(): Left<L, T>;

  abstract asInstanceOfRight<T = L>(): Right<T, R>;

  protected abstract leftGet(): L;

  left: LeftProjection<L, R>;

  isLeft(): this is Left<L, R>;

  match<RT>(ifLeft: (l: L) => RT, ifRight: (r: R) => RT): any;

  map<U>(mapper: (t: R) => U): Either<L, U>;

  replace<U>(val: U): Either<L, U>;

  getOrElse<U>(valIfLeft: U): R | U;

  fold<U>(fa: (r: R) => U, fb: (l: L) => U): U;

  flatMap<U>(mapper: (t: R) => Either<L, U>): Either<L, U>;

  flatten(): R | Left<L, R extends Either<L, infer U> ? U : R>;

  orNull(): R | null;

  filterOrElse(pred: (t: R) => boolean, orElse: L): Either<L, R>;

  forEach(fn: (t: R) => void): void;

  exists(pred: (t: R) => boolean): boolean;

  forall(pred: (t: R) => boolean): boolean;

  contains(value: R): boolean;

  toOption(): Option<R>;

  toString(): string;

  print(): void;

  static when: <L_1, R_1>(cond: boolean, right: R_1, left: L_1) => Either<L_1, R_1>;

  static unless: <L_1, R_1>(cond: boolean, right: R_1, left: L_1) => Either<L_1, R_1>;
}
export declare class Right<L, R> extends Either<L, R> {
  protected readonly value: R;

  constructor(value: R);

  readonly isRight: () => boolean;

  get(): R;

  leftGet(): never;

  asInstanceOfLeft(): never;

  asInstanceOfRight<T = L>(): Right<T, R>;

  promise(): Promise<R>;
}
export declare class Left<L, R> extends Either<L, R> {
  protected readonly value: L;

  constructor(value: L);

  readonly isRight: () => boolean;

  get(): never;

  leftGet(): L;

  asInstanceOfLeft<T = R>(): Left<L, T>;

  asInstanceOfRight(): never;

  promise(): Promise<L>;
}
declare class LeftProjection<L, R> {
  either: Either<L, R>;

  constructor(either: Either<L, R>);

  get(): any;

  map<U>(mapper: (t: L) => U): Either<U, R>;

  replace<U>(val: U): Either<U, R>;

  getOrElse<U>(valIfRight: U): any;

  flatMap<U>(mapper: (t: L) => Either<U, R>): Either<U, R>;

  flatten(): any;

  orNull(): any;

  filterOrElse(pred: (t: L) => boolean, orElse: R): Either<L, R>;

  forEach(fn: (t: L) => void): void;

  exists(pred: (t: L) => boolean): boolean;

  forall(pred: (t: L) => boolean): boolean;

  contains(value: L): boolean;

  toOption(): Option<L>;
}
export declare const right: <L, R>(t: R) => Right<L, R>;
export declare const left: <L, R>(t: L) => Left<L, R>;
export const tryCatch: <L, R>(onSuccess: () => R, onError: () => L) => Either<L, R>;

export {};
