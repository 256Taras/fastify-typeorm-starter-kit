/**
 * @template T
 * @template {keyof T} K
 * @param {T} obj
 * @param {K[]} keys
 * @returns {Pick<T, K>}
 */
export function pick(obj, keys) {
  const result = {};

  keys.forEach((key) => {
    // @ts-ignore
    if (!(key in obj)) {
      // @ts-ignore
      throw new Error(`Key ${key} does not exist in object.`);
    }
    // @ts-ignore
    result[key] = obj[key];
  });

  // @ts-ignore
  return result;
}
