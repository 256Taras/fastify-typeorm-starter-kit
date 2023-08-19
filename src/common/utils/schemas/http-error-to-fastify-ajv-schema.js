const HTTP_STATUS_CODE_LENGTH = 3;
const CUSTOM_ERROR_CODE_LENGTH = 6;
const DELIMITER_CODE_LENGTH = 3;

/**
 * @param {import('../../errors/types/http-error-response.interface').IHttpErrorResponse} httpFastifyError
 */
export const convertHttpErrorToFastifyAjvSchemaError = (httpFastifyError) => ({
  [`${httpFastifyError.statusCode}`]: {
    type: "object",
    required: ["code", "statusCode", "userMessage"],
    properties: {
      code: { enum: [httpFastifyError.code] },
      statusCode: { enum: [httpFastifyError.statusCode] },
      userMessage: { enum: [httpFastifyError.userMessage] },
      developerMessage: { type: "string" },
      ...(httpFastifyError.statusCode === 400
        ? {
            errorDetails: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["userMessage", "developerMessage"],
                  },
                  message: {
                    type: "string",
                  },
                  location: {
                    type: "string",
                    enum: ["body", "query", "params"],
                  },
                },
                required: ["type", "message", "location"],
              },
            },
          }
        : {}),
      traceId: { type: "string" },
    },
  },
});

const sortFastifyAjvSchemaErrorByFullCodeAsc = (a, b) => {
  const aFullCode = Object.keys(a)[0];
  const bFullCode = Object.keys(b)[0];

  const aHttpStatusCode = aFullCode.slice(0, HTTP_STATUS_CODE_LENGTH);
  const bHttpStatusCode = bFullCode.slice(0, HTTP_STATUS_CODE_LENGTH);

  if (aHttpStatusCode > bHttpStatusCode) return 1;
  if (aHttpStatusCode < bHttpStatusCode) return -1;
  // if equal
  const errorCodeStartAt = HTTP_STATUS_CODE_LENGTH + DELIMITER_CODE_LENGTH;
  const aCustomErrorCode = aFullCode.slice(errorCodeStartAt, errorCodeStartAt + CUSTOM_ERROR_CODE_LENGTH);
  const bCustomErrorCode = bFullCode.slice(errorCodeStartAt, errorCodeStartAt + CUSTOM_ERROR_CODE_LENGTH);
  if (aCustomErrorCode > bCustomErrorCode) return 1;
  if (aCustomErrorCode < bCustomErrorCode) return -1;
  return 0;
};

/**
 *
 * @param {import('../../errors/types/http-error-collection.interface').THttpErrorCollection} httpErrorCollection
 */
export const convertHttpErrorCollectionToFastifyAjvSchemaErrorList = (httpErrorCollection) => {
  const list = [
    ...Object.values(httpErrorCollection).map((value) => convertHttpErrorToFastifyAjvSchemaError(value)),
  ];
  return list.sort(sortFastifyAjvSchemaErrorByFullCodeAsc);
};

/**
 *
 * @param {import('../../errors/types/http-error-collection.interface').THttpErrorCollection} httpErrorCollection
 */
export const convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection = (httpErrorCollection) => {
  const list = convertHttpErrorCollectionToFastifyAjvSchemaErrorList(httpErrorCollection);
  return list.reduce(
    (obj, item) => Object.assign(obj, { [Object.keys(item)[0]]: item[[Object.keys(item)[0]]] }),
    {},
  );
};
