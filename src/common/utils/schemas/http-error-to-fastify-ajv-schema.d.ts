export function convertHttpErrorToFastifyAjvSchemaError(
  httpFastifyError: import("../../../@types").HttpErrorResponseType,
): {
  [x: string]: {
    type: string;
    required: string[];
    properties: {
      code: {
        enum: number[];
      };
      httpStatusCode: {
        enum: number[];
      };
      userMessage: {
        enum: string[];
      };
      developerMessage: {
        type: string;
      };
    };
  };
};
export function convertHttpErrorCollectionToFastifyAjvSchemaErrorList(
  httpErrorCollection: import("../../../@types").HttpErrorCollection,
): {
  [x: string]: {
    type: string;
    required: string[];
    properties: {
      code: {
        enum: number[];
      };
      httpStatusCode: {
        enum: number[];
      };
      userMessage: {
        enum: string[];
      };
      developerMessage: {
        type: string;
      };
    };
  };
}[];
export function convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection(
  httpErrorCollection: import("../../../@types").HttpErrorCollection,
): {
  [x: string]: {
    type: string;
    required: string[];
    properties: {
      code: {
        enum: number[];
      };
      httpStatusCode: {
        enum: number[];
      };
      userMessage: {
        enum: string[];
      };
      developerMessage: {
        type: string;
      };
    };
  };
};
