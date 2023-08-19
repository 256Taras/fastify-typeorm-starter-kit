import { BadRequestException } from "#errors";

/**
 * Formats error messages for object validation errors according to the given schema.
 *
 * @param {Object[]} errors - An array of error objects.
 * @param {string} dataVar - The variable name to use in error messages.
 * @returns {Error} - The formatted error message as an Error object.
 */
function defaultSchemaErrorFormatter(errors, dataVar) {
  let text = "";
  const separator = ", ";

  for (let i = 0; i !== errors.length; i += 1) {
    const e = errors[i];
    text += `${dataVar + (e.instancePath ?? "")} ${e.message}${separator}`;
  }
  return new Error(text.slice(0, -separator.length));
}

/**
 * Validates data against a JSON schema using a request object's compileValidationSchema method.
 *
 * @param {Object} req - The request object.
 * @param {Object} data - The data to validate.
 * @param {Object} schema - The JSON schema to validate against.
 * @param {string} context - The context for the error message.
 * @throws {BadRequestException} - Throws a BadRequestException if the data fails validation.
 * @returns {boolean} - Returns true if the data is valid.
 */
export const validateSchema = (req, data, schema, context) => {
  const validate = req.compileValidationSchema(schema);
  const isValid = validate(data);

  if (isValid) {
    return true;
  }

  const error = defaultSchemaErrorFormatter(validate.errors, context);

  throw new BadRequestException(error.message);
};
