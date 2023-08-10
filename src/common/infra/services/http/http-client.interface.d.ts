import { Readable } from "stream";

import { Dispatcher } from "undici";

export declare interface IHttpRequestOptions {
  basePath?: string;
  method?: Dispatcher.HttpMethod;
  headers?: Record<string, string>;
  jsonBody?: Record<string, unknown>;
  formBody?: Record<string, string | number | boolean | null | undefined>;
  body?: Buffer | Readable | string;
  searchParams?: Record<string, string | null | undefined>;
  firstByteTimeout?: number;
  requestTimeout?: number;
  maxRedirections?: number;
  idempotent?: boolean;
}

/**
 * Interface for an HTTP client service that provides methods for making HTTP requests.
 */
export interface IHttpClient {
  /**
   * Sends an HTTP GET request to the specified path.
   * @param path The path to send the GET request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  get(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP POST request to the specified path.
   * @param path The path to send the POST request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  post(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP PUT request to the specified path.
   * @param path The path to send the PUT request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  put(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP PATCH request to the specified path.
   * @param path The path to send the PATCH request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  patch(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP DELETE request to the specified path.
   * @param path The path to send the DELETE request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  delete(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP OPTIONS request to the specified path.
   * @param path The path to send the OPTIONS request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  options(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP HEAD request to the specified path.
   * @param path The path to send the HEAD request to.
   * @param options Optional HTTP request options.
   * @returns A Promise that resolves with the response data.
   */
  head(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  /**
   * Sends an HTTP request to the specified path with the specified HTTP method.
   * @param path The path to send the HTTP request to.
   * @param _options
   * @returns A Promise that resolves with the response data.
   */
  request(path: string, _options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;
}
