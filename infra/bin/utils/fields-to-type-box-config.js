const getTypeBoxType = (type, size, name) => {
  switch (type) {
    case "string":
      if (size) {
        return `Type.String({ maxLength: ${size},
        errorMessage: {
          maxLength: "Field ${name} must not exceed ${size} characters",
        } })`;
      }
      return `Type.String({ errorMessage: "Field ${name} must be an string" })`;
    case "text":
      if (size) {
        return `Type.String({ maxLength: ${size},
        errorMessage: {
          maxLength: "Field ${name} must not exceed ${size} characters",
        } })`;
      }
      return `Type.String({ errorMessage: "Field ${name} must be an string" })`;
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
  const errorMessages = {
    createdAt: "CreatedAt is required",
  };

  [...fields].forEach(({ name, type, size, optional }) => {
    if (!type) return;

    const entry = `${name}: ${
      optional ? `Type.Optional(${getTypeBoxType(type, size, name)})` : getTypeBoxType(type, size, name)
    },`;

    if (!optional) {
      errorMessages[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    entries.push(entry);
  });

  let errorString = "{\n";
  for (const key in errorMessages) {
    errorString += `  ${key}: '${errorMessages[key]}',\n`;
  }
  errorString += "}";

  return { entries: entries.join("\n  "), errorMessages: errorString };
};
