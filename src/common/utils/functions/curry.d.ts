type PartialTuple<Tupled extends any[], Values extends any[] = []> = Tupled extends [
  infer Next,
  ...infer Remaining,
]
  ? PartialTuple<Remaining, [...Values, Next?]>
  : [...Values, ...Tupled];
type PartialParams<Func extends (...args: any[]) => any> = PartialTuple<Parameters<Func>>;
type RemainingParams<Params extends any[], RequiredParams extends any[]> = RequiredParams extends [
  infer RequiredParam,
  ...infer OtherRequiredParams,
]
  ? Params extends [infer Param, ...infer OtherParams]
    ? Param extends RequiredParam
      ? RemainingParams<OtherParams, OtherRequiredParams>
      : never
    : RequiredParams
  : [];
type CurriedFunction<SuppliedParams extends any[], Fun extends (...args: any[]) => any> = <
  MoreArgs extends PartialTuple<RemainingParams<SuppliedParams, Parameters<Fun>>>,
>(
  ...args: MoreArgs
) => // eslint-disable-next-line no-use-before-define
CurriedOrValue<[...SuppliedParams, ...MoreArgs], Fun>;
type CurriedOrValue<SuppliedParams extends any[], Fun extends (...args: any[]) => any> = RemainingParams<
  SuppliedParams,
  Parameters<Fun>
> extends [any, ...any[]]
  ? CurriedFunction<SuppliedParams, Fun>
  : ReturnType<Fun>;

export declare function curry<Fun extends (...param: any[]) => any, InitialParams extends PartialParams<Fun>>(
  fnToCurry: Fun,
  ...initialParams: InitialParams
): CurriedFunction<InitialParams, Fun>;

export {};
