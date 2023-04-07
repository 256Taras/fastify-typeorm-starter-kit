export function curry(fnToCurry, ...initialParams) {
  return (...params) => {
    const totalParams = [...initialParams, ...params];
    return totalParams.length >= fnToCurry.length ? fnToCurry(...totalParams) : curry(fnToCurry, ...totalParams);
  };
}
