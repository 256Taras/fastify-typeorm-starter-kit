const getTypeBoxType = (type, size, name) => {
  switch (type) {
    case "string":
      if (size) {
        return `Type.String({ maxLength: ${size} })`;
      }
      return `Type.String()`;
    case "text":
      if (size) {
        return `Type.String({ maxLength: ${size} })`;
      }
      return `Type.String()`;
    case "integer":
      return `Type.Integer({ errorMessage: "Field ${name} must be an integer" })`;
    case "float":
      return `Type.Number({ errorMessage: "Field ${name} must be a number" })`;
    case "json":
      return `Type.String()`;
    case "boolean":
      return `Type.Boolean({ errorMessage: "Field ${name} must be a boolean" })`;
    case "uuid":
      return `Type.String({ format: "uuid" })`;
    case "date":
      return `Type.String({ format: "date-time",
        errorMessage: {
          format: "Field ${name} must be a valid date-time",
        } })`;
    default:
      throw new Error(`Unsupported type '${type}'`);
  }
};

export const fieldsToTypeBoxConfig = (fields) => {
  const entries = [];

  [...fields].forEach(({ name, type, size, optional }) => {
    if (!type) return;

    const entry = `${name}: ${
      optional ? `Type.Optional(${getTypeBoxType(type, size, name)})` : getTypeBoxType(type, size, name)
    },`;

    entries.push(entry);
  });

  return { entries: entries.join("\n  ") };
};
