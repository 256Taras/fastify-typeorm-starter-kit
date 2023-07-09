const getTypeBoxType = (type, size) => {
  switch (type) {
    case "string":
      return `Type.String({ maxLength: ${size} })`;
    case "integer":
      return `Type.Integer()`;
    case "float":
      return `Type.Number()`;
    case "json":
      return `Type.String()`;
    case "boolean":
      return `Type.Boolean()`;
    case "uuid":
      return `Type.String({ format: "uuid" })`;
    case "date":
      return `Type.String({ format: "date-time" })`;
    default:
      throw new Error(`Unsupported type '${type}'`);
  }
};

export const fieldsToTypeBoxConfig = (fields) => {
  const entries = [];
  fields.forEach(({ name, type, size, optional }) => {
    if (!type) return;
    const entry = `${name}: ${
      optional ? `Type.Optional(${getTypeBoxType(type, size)})` : getTypeBoxType(type, size)
    },`;
    entries.push(entry);
  });

  return entries.join("\n  ");
};
