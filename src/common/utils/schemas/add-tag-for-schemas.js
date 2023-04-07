export const mixinTagForSchemas = (schemas, tag) => {
  Object.keys(schemas).forEach((k) => {
    // I had to comment here because the immutable scheme can increase the time to initialize the project
    // eslint-disable-next-line no-param-reassign
    schemas[k].tags = tag;
  });
  return schemas;
};
