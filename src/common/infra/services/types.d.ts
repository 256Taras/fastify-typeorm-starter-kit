import { ILogger } from "#services/logger/logger.interface";
import { IHttpClient } from "#services/http/http-client.interface";
import { IEncrypterInterface } from "#services/encrypter/encrypter.interface";

declare module "@fastify/awilix" {
  interface Cradle {
    encrypterService: IEncrypterInterface;
    logger: ILogger;
    httpClientService: IHttpClient;
  }
}
