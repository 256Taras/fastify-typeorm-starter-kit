export function pipe(a, ...fns) {
  return fns.reduce((res, fn) => fn(res), a);
}
