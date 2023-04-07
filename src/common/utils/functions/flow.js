export function flow(ua, ...fns) {
  return (...args) => fns.reduce((a, fab) => fab(a), ua(...args));
}
