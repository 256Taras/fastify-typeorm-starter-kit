export function camelToSnakeCase(camelCaseString) {
  const snakeCaseString = camelCaseString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  return snakeCaseString.toUpperCase();
}
