/**
 * @template T
 * @param {T} schemas
 * @param {string} tag
 * @returns {T} T
 */
export const mixinTagForSchemas = (schemas, tag) => {
  // @ts-ignore
  Object.keys(schemas).forEach((k) => {
    schemas[k].tags = tag;
  });
  return schemas;
};
