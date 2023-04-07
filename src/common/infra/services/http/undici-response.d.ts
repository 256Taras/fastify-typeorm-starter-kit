import { Dispatcher } from "undici";

import ResponseData = Dispatcher.ResponseData;

export declare class UndiciResponse {
  constructor(response: ResponseData);

  ok(): boolean;

  json(): Record<string, unknown>;

  text(): string;
}
