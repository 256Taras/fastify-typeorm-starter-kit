export function omit(obj, keys) {
  return keys.reduce(
    (result, key) => {
      // eslint-disable-next-line no-param-reassign
      delete result[key];
      return result;
    },
    { ...obj },
  );
}
