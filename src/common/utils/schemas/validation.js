import { BadRequestException } from "#errors";

function defaultSchemaErrorFormatter(errors, dataVar) {
  let text = "";
  const separator = ", ";

  for (let i = 0; i !== errors.length; i += 1) {
    const e = errors[i];
    text += `${dataVar + (e.instancePath || "")} ${e.message}${separator}`;
  }
  return new Error(text.slice(0, -separator.length));
}

export const validateSchema = (req, data, schema, context) => {
  const validate = req.compileValidationSchema(schema);
  const isValid = validate(data);

  if (isValid) {
    return true;
  }

  const error = defaultSchemaErrorFormatter(validate.errors, context);

  throw new BadRequestException(error.message);
};
