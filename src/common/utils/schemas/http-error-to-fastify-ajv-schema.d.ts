import { IHttpErrorResponse } from "#common/errors/types/http-error-response.interface";
import { THttpErrorCollection } from "#common/errors/types/http-error-collection.interface";

export declare function convertHttpErrorToFastifyAjvSchemaError(httpFastifyError: IHttpErrorResponse): {
  [x: string]: {
    type: string;
    required: string[];
    properties: {
      code: {
        enum: number[];
      };
      statusCode: {
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
export declare function convertHttpErrorCollectionToFastifyAjvSchemaErrorList(httpErrorCollection: THttpErrorCollection): {
  [x: string]: {
    type: string;
    required: string[];
    properties: {
      code: {
        enum: number[];
      };
      statusCode: {
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
export declare function convertHttpErrorCollectionToFastifyAjvSchemaErrorCollection(
  httpErrorCollection: THttpErrorCollection,
): {
  [x: string]: {
    type: string;
    required: string[];
    properties: {
      code: {
        enum: number[];
      };
      statusCode: {
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
