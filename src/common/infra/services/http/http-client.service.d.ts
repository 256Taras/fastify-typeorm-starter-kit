import { Dispatcher } from "undici";

import { IHttpClient, IHttpRequestOptions } from "#services/http/http-client.interface";

export declare class HttpClientService implements IHttpClient {
  get(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  post(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  put(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  patch(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  delete(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  options(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  head(path: string, options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;

  request(path: string, _options?: IHttpRequestOptions): Promise<Dispatcher.ResponseData>;
}
