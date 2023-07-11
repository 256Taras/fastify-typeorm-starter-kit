import { IncomingHttpHeaders } from "http";

import { Dispatcher } from "undici";

import { IHttpRequestOptions } from "#services/http/http-client.interface";

export declare class HttpRequestError extends Error {
  readonly statusCode: number;

  readonly headers: IncomingHttpHeaders;

  readonly body: string;

  readonly request: IHttpRequestOptions;

  readonly response: Dispatcher.ResponseData;

  constructor(url: URL, request: IHttpRequestOptions, response: Dispatcher.ResponseData, body: string);

  toJSON(): {
    statusCode: number;
    headers: IncomingHttpHeaders;
    body: string;
    stack: string | undefined;
  };
}
